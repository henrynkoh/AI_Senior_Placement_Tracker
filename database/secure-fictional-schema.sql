-- DRAFT ONLY. NOT APPLIED TO ANY DATABASE.
-- Senior Placement secure schema - no client PII/PHI allowed in this initial phase.
-- Review and test RLS against a dedicated Supabase staging project before applying.
begin;
create table if not exists public.placement_cases (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
 case_code text not null check (case_code ~ '^SP-[0-9]{3,6}$'),
 is_fictional boolean not null default true check (is_fictional = true),
 inquiry_date date not null default current_date,
 consent_status text not null default 'pending' check (consent_status in ('pending','granted_for_test','declined')),
 verification_status text not null default 'needs_official_verification'
  check (verification_status in ('needs_official_verification','question_sent','fictional_response_logged')),
 hcs_status text not null default 'not_contacted' check (hcs_status in ('not_contacted','unverified','fictional_contact')),
 placement_stage text not null default 'waiting' check (placement_stage in ('waiting','intake','review','comparison','closed')),
 staff_label text not null default 'Solo operator' check (length(staff_label)<=100),
 next_action text not null default '' check (length(next_action)<=500),
 followup_date date,
 official_source text not null default '' check(length(official_source)<=500),
 human_review text not null default 'pending' check(human_review in ('pending','reviewed')),
 city_label text not null default 'Tumwater' check(length(city_label)<=80),
 updated_at timestamptz not null default now(),
 created_at timestamptz not null default now(),
 unique(owner_id,case_code)
);
create index if not exists placement_cases_owner_deadline_idx on public.placement_cases(owner_id,followup_date);
alter table public.placement_cases enable row level security;
alter table public.placement_cases force row level security;
revoke all on public.placement_cases from anon, authenticated;
grant select, insert, update, delete on public.placement_cases to authenticated;
create policy placement_cases_read_own on public.placement_cases
 for select to authenticated using (auth.uid() is not null and owner_id = (select auth.uid()));
create policy placement_cases_insert_own on public.placement_cases
 for insert to authenticated with check (auth.uid() is not null and owner_id = (select auth.uid()) and is_fictional = true);
create policy placement_cases_update_own on public.placement_cases
 for update to authenticated using (auth.uid() is not null and owner_id = (select auth.uid()))
 with check (owner_id = (select auth.uid()) and is_fictional = true);
create policy placement_cases_delete_own on public.placement_cases
 for delete to authenticated using (auth.uid() is not null and owner_id = (select auth.uid()));
commit;
