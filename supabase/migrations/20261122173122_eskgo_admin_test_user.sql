-- Provisional admin test account for mansurtiao@gmail.com.
-- Role lives in app_metadata, which the user cannot edit.
-- The account password stays out of the repository.
update auth.users
set
  raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', 'admin'),
  email_confirmed_at = coalesce(email_confirmed_at, now()),
  updated_at = now()
where lower(email) = 'mansurtiao@gmail.com';
