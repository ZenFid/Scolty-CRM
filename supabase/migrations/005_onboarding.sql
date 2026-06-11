-- 005_onboarding.sql — Add profile fields for onboarding flow
alter table user_profiles
  add column if not exists display_name    text,
  add column if not exists workspace_name  text,
  add column if not exists avatar_color    text not null default '#38bdf8',
  add column if not exists onboarded       boolean not null default false;
