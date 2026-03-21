create table if not exists public.app_users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  plan text not null default 'FREE',
  created_at timestamp with time zone not null default timezone('utc', now()),
  updated_at timestamp with time zone not null default timezone('utc', now()),
  constraint app_users_plan_check check (plan in ('FREE', 'PRO'))
);

create unique index if not exists app_users_email_lower_idx on public.app_users (lower(email));
create index if not exists app_users_plan_idx on public.app_users (plan);

create or replace function public.set_app_users_updated_at()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_app_users_updated_at on public.app_users;
create trigger set_app_users_updated_at
before update on public.app_users
for each row
execute function public.set_app_users_updated_at();

create or replace function public.handle_app_user_from_auth()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.email is null then
    return new;
  end if;

  insert into public.app_users (id, email)
  values (new.id, lower(new.email))
  on conflict (id) do update
    set email = excluded.email,
        updated_at = timezone('utc', now());

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_app_users on auth.users;
create trigger on_auth_user_created_app_users
after insert on auth.users
for each row
execute function public.handle_app_user_from_auth();

insert into public.app_users (id, email, plan, created_at, updated_at)
select
  id,
  lower(email),
  'FREE',
  created_at,
  coalesce(updated_at, created_at)
from auth.users
where email is not null
on conflict (id) do update
  set email = excluded.email,
      updated_at = timezone('utc', now());

alter table public.app_users enable row level security;

drop policy if exists "Users can view their own app user row" on public.app_users;
create policy "Users can view their own app user row"
on public.app_users
for select
to authenticated
using ((select auth.uid()) = id);
