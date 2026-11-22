-- Eskgo ledger: profiles, cards, budget, transactions, goals, contributions.
-- Money is stored in centavos (bigint). Rollback is at the bottom of this file.

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create type public.card_tone as enum ('lime', 'lilac', 'cream');
create type public.budget_icon as enum ('utensils', 'home', 'car', 'sparkle');
create type public.transaction_icon as enum ('cart', 'play', 'car', 'coffee', 'home');
create type public.payment_kind as enum ('card', 'cash');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null check (char_length(btrim(full_name)) > 0),
  email text not null,
  hide_balance_on_open boolean not null default false,
  opening_balance_cents bigint not null default 0 check (opening_balance_cents >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null check (char_length(btrim(name)) > 0),
  last_four text not null check (last_four ~ '^[0-9]{4}$'),
  limit_cents bigint not null check (limit_cents > 0),
  due_day integer not null check (due_day between 1 and 31),
  tone public.card_tone not null default 'cream',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.budget_categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null check (char_length(btrim(name)) > 0),
  planned_cents bigint not null check (planned_cents > 0),
  icon public.budget_icon not null default 'sparkle',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, name)
);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  description text not null check (char_length(btrim(description)) > 0),
  category_name text not null,
  payment_kind public.payment_kind not null,
  card_id uuid references public.cards (id) on delete restrict,
  occurred_on date not null,
  amount_cents bigint not null check (amount_cents > 0),
  icon public.transaction_icon not null default 'cart',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint transactions_payment_matches_card check (
    (payment_kind = 'cash' and card_id is null)
    or (payment_kind = 'card' and card_id is not null)
  )
);

create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null check (char_length(btrim(name)) > 0),
  target_cents bigint not null check (target_cents > 0),
  deadline date not null,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.contributions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  goal_id uuid not null references public.goals (id) on delete cascade,
  amount_cents bigint not null check (amount_cents > 0),
  occurred_on date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index cards_user_id_idx on public.cards (user_id);
create index budget_categories_user_id_idx on public.budget_categories (user_id);
create index transactions_user_date_idx on public.transactions (user_id, occurred_on desc);
create index transactions_user_category_idx on public.transactions (user_id, category_name);
create index transactions_card_id_idx on public.transactions (card_id) where card_id is not null;
create index goals_user_id_idx on public.goals (user_id);
create unique index goals_one_featured_per_user on public.goals (user_id) where featured;
create index contributions_goal_id_idx on public.contributions (goal_id);
create index contributions_user_date_idx on public.contributions (user_id, occurred_on desc);

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger cards_set_updated_at before update on public.cards
for each row execute function public.set_updated_at();
create trigger budget_categories_set_updated_at before update on public.budget_categories
for each row execute function public.set_updated_at();
create trigger transactions_set_updated_at before update on public.transactions
for each row execute function public.set_updated_at();
create trigger goals_set_updated_at before update on public.goals
for each row execute function public.set_updated_at();
create trigger contributions_set_updated_at before update on public.contributions
for each row execute function public.set_updated_at();

create function public.rename_category_on_transactions()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.name is distinct from old.name then
    update public.transactions
    set category_name = new.name
    where user_id = new.user_id
      and category_name = old.name;
  end if;
  return new;
end;
$$;

create trigger budget_categories_rename
after update of name on public.budget_categories
for each row execute function public.rename_category_on_transactions();

create function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(nullif(btrim(new.raw_user_meta_data ->> 'name'), ''), split_part(new.email, '@', 1)),
    new.email
  );

  insert into public.budget_categories (user_id, name, planned_cents, icon)
  values
    (new.id, 'Alimentação', 62000, 'utensils'),
    (new.id, 'Moradia', 120000, 'home'),
    (new.id, 'Transporte', 24000, 'car'),
    (new.id, 'Lazer', 39000, 'sparkle');

  return new;
end;
$$;

revoke all on function private.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_user();

alter table public.profiles enable row level security;
alter table public.cards enable row level security;
alter table public.budget_categories enable row level security;
alter table public.transactions enable row level security;
alter table public.goals enable row level security;
alter table public.contributions enable row level security;

alter table public.profiles force row level security;
alter table public.cards force row level security;
alter table public.budget_categories force row level security;
alter table public.transactions force row level security;
alter table public.goals force row level security;
alter table public.contributions force row level security;

create policy profiles_select on public.profiles
for select to authenticated
using (id = (select auth.uid()));

create policy profiles_update on public.profiles
for update to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

create policy profiles_delete on public.profiles
for delete to authenticated
using (id = (select auth.uid()));

create policy cards_select on public.cards
for select to authenticated using (user_id = (select auth.uid()));
create policy cards_insert on public.cards
for insert to authenticated with check (user_id = (select auth.uid()));
create policy cards_update on public.cards
for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));
create policy cards_delete on public.cards
for delete to authenticated using (user_id = (select auth.uid()));

create policy budget_categories_select on public.budget_categories
for select to authenticated using (user_id = (select auth.uid()));
create policy budget_categories_insert on public.budget_categories
for insert to authenticated with check (user_id = (select auth.uid()));
create policy budget_categories_update on public.budget_categories
for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));
create policy budget_categories_delete on public.budget_categories
for delete to authenticated using (user_id = (select auth.uid()));

create policy transactions_select on public.transactions
for select to authenticated using (user_id = (select auth.uid()));
create policy transactions_insert on public.transactions
for insert to authenticated with check (
  user_id = (select auth.uid())
  and (
    (payment_kind = 'cash' and card_id is null)
    or (
      payment_kind = 'card'
      and exists (
        select 1 from public.cards
        where cards.id = card_id
          and cards.user_id = (select auth.uid())
      )
    )
  )
);
create policy transactions_update on public.transactions
for update to authenticated
using (user_id = (select auth.uid()))
with check (
  user_id = (select auth.uid())
  and (
    (payment_kind = 'cash' and card_id is null)
    or (
      payment_kind = 'card'
      and exists (
        select 1 from public.cards
        where cards.id = card_id
          and cards.user_id = (select auth.uid())
      )
    )
  )
);
create policy transactions_delete on public.transactions
for delete to authenticated using (user_id = (select auth.uid()));

create policy goals_select on public.goals
for select to authenticated using (user_id = (select auth.uid()));
create policy goals_insert on public.goals
for insert to authenticated with check (user_id = (select auth.uid()));
create policy goals_update on public.goals
for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));
create policy goals_delete on public.goals
for delete to authenticated using (user_id = (select auth.uid()));

create policy contributions_select on public.contributions
for select to authenticated using (user_id = (select auth.uid()));
create policy contributions_insert on public.contributions
for insert to authenticated with check (
  user_id = (select auth.uid())
  and exists (
    select 1 from public.goals
    where goals.id = goal_id
      and goals.user_id = (select auth.uid())
  )
);
create policy contributions_update on public.contributions
for update to authenticated
using (user_id = (select auth.uid()))
with check (
  user_id = (select auth.uid())
  and exists (
    select 1 from public.goals
    where goals.id = goal_id
      and goals.user_id = (select auth.uid())
  )
);
create policy contributions_delete on public.contributions
for delete to authenticated using (user_id = (select auth.uid()));

revoke all on table public.profiles, public.cards, public.budget_categories, public.transactions, public.goals, public.contributions from anon;
grant select, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.cards, public.budget_categories, public.transactions, public.goals, public.contributions to authenticated;
revoke all on function public.set_updated_at() from public, anon, authenticated;
revoke all on function public.rename_category_on_transactions() from public, anon, authenticated;

-- Rollback:
-- drop trigger if exists on_auth_user_created on auth.users;
-- drop function if exists private.handle_new_user();
-- drop table if exists public.contributions, public.goals, public.transactions, public.budget_categories, public.cards, public.profiles cascade;
-- drop type if exists public.payment_kind, public.transaction_icon, public.budget_icon, public.card_tone;
-- drop schema if exists private cascade;
