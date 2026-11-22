-- Temporary sample ledger for mansurtiao@gmail.com.
-- The demo password is not stored in this repository.
-- Delete this user, and the rows the signup trigger creates, before real data.

do $$
declare
  demo uuid := gen_random_uuid();
  card_principal uuid;
  card_salario uuid;
  card_viagem uuid;
  goal_japao uuid;
  goal_reserva uuid;
  goal_curso uuid;
  goal_carro uuid;
begin
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-0000-0000-000000000000',
    demo,
    'authenticated',
    'authenticated',
    'mansurtiao@gmail.com',
    extensions.crypt('change-me', extensions.gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Tião Mansur"}'::jsonb,
    now(),
    now()
  );

  insert into auth.identities (
    provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
  ) values (
    demo::text,
    demo,
    jsonb_build_object('sub', demo::text, 'email', 'mansurtiao@gmail.com', 'email_verified', true),
    'email',
    now(),
    now(),
    now()
  );

  update public.profiles
  set opening_balance_cents = 1489310
  where id = demo;

  insert into public.cards (user_id, name, last_four, limit_cents, due_day, tone)
  values (demo, 'Principal', '4552', 300000, 30, 'lilac')
  returning id into card_principal;

  insert into public.cards (user_id, name, last_four, limit_cents, due_day, tone)
  values (demo, 'Salário', '6917', 300000, 4, 'cream')
  returning id into card_salario;

  insert into public.cards (user_id, name, last_four, limit_cents, due_day, tone)
  values (demo, 'Viagem', '1180', 300000, 19, 'lime')
  returning id into card_viagem;

  insert into public.transactions (user_id, description, category_name, payment_kind, card_id, occurred_on, amount_cents, icon)
  values
    (demo, 'Mercado Pão de Açúcar', 'Alimentação', 'card', card_principal, current_date, 28640, 'cart'),
    (demo, 'Netflix', 'Assinaturas', 'card', card_principal, current_date, 5590, 'play'),
    (demo, 'Uber', 'Transporte', 'card', card_salario, current_date - 1, 3280, 'car'),
    (demo, 'Café do bairro', 'Alimentação', 'cash', null, current_date - 1, 1800, 'coffee');

  insert into public.goals (user_id, name, target_cents, deadline, featured)
  values (demo, 'Viagem ao Japão', 2000000, date '2027-12-01', true)
  returning id into goal_japao;

  insert into public.goals (user_id, name, target_cents, deadline, featured)
  values (demo, 'Reserva', 1000000, date '2026-12-01', false)
  returning id into goal_reserva;

  insert into public.goals (user_id, name, target_cents, deadline, featured)
  values (demo, 'Curso', 300000, date '2027-06-01', false)
  returning id into goal_curso;

  insert into public.goals (user_id, name, target_cents, deadline, featured)
  values (demo, 'Carro novo', 4000000, date '2028-01-01', false)
  returning id into goal_carro;

  insert into public.contributions (user_id, goal_id, amount_cents, occurred_on)
  values
    (demo, goal_japao, 1360000, current_date),
    (demo, goal_reserva, 720000, current_date),
    (demo, goal_curso, 270000, current_date),
    (demo, goal_carro, 960000, current_date);
end $$;
