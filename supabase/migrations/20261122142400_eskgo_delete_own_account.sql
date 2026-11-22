-- A signed-in person can delete only the auth user behind auth.uid().
-- The privileged delete stays in private. The public function is a thin caller.

create or replace function private.delete_own_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  delete from auth.users where id = auth.uid();
end;
$$;

create or replace function public.delete_own_account()
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  perform private.delete_own_account();
end;
$$;

revoke all on function public.delete_own_account() from public, anon;
revoke all on function private.delete_own_account() from public, anon;
grant usage on schema private to authenticated;
grant execute on function private.delete_own_account() to authenticated;
grant execute on function public.delete_own_account() to authenticated;
