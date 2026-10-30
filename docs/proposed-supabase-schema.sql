-- PROPOSED SCHEMA ONLY — NOT APPLIED. Fictional/regulated workflow requires review before use.
-- Supabase Auth owns identities. No automatic signup permission to handle real clients.
create table if not exists public.placement_cases (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  case_code text not null check (case_code ~ '^SP-[0-9]{3,8}$'),
  fictional boolean not null default true check (fictional = true),
  inquiry_date date not null default current_date,
  consent_status text not null default 'pending'
    check (consent_status in ('not_requested','pending','granted_for_test','declined')),
  medicaid_verification text not null default 'needs_official_verification'
    check (medicaid_verification in ('needs_official_verification','application_submitted_unverified',
      'financial_review_reported_unverified','care_needs_assessment_pending_unverified',
      'coverage_change_question_open','renewal_date_needs_confirmation',
      'unresolved_program_question','official_notice_recorded_by_operator')),
  hcs_contact_status text not null default 'not_contacted',
  afh_stage text not null default 'waiting',
  assigned_staff text not null default 'Solo operator',
  next_action text not null default '' check (length(next_action) <= 500),
  deadline date,
  source_note text not null default 'Unverified',
  reviewed_at timestamptz,
  last_update timestamptz not null default now(),
  unique (owner_id,case_code)
);
create index if not exists placement_cases_owner_deadline
  on public.placement_cases(owner_id,deadline) where deadline is not null;
alter table public.placement_cases enable row level security;
alter table public.placement_cases force row level security;
revoke all on public.placement_cases from anon;
grant select,insert,update,delete on public.placement_cases to authenticated;

create policy "read own fictional cases" on public.placement_cases for select
  to authenticated using ((select auth.uid()) = owner_id);
create policy "insert own fictional cases" on public.placement_cases for insert
  to authenticated with check ((select auth.uid()) = owner_id and fictional = true);
create policy "update own fictional cases" on public.placement_cases for update
  to authenticated using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id and fictional = true);
create policy "delete own fictional cases" on public.placement_cases for delete
  to authenticated using ((select auth.uid()) = owner_id);

-- Any regulated client records MUST use a new, separately reviewed schema;
-- do NOT remove the fictional=true constraint without a complete legal/security review.
