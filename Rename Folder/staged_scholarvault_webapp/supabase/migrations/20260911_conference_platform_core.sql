-- ScholarVault Configuration-Driven Conference Platform Core Schema
-- Migration: 20260911_conference_platform_core.sql

-- 1. Conference Verification Challenges (Anti-abuse, rate limiting, IP & code hashing)
create table if not exists public.conference_verification_challenges (
  id uuid primary key default gen_random_uuid(),
  conference_edition_id uuid not null references public.conference_editions(id) on delete cascade,
  email_hash text not null,
  code_hash text not null,
  submission_id uuid references public.conference_submissions(id) on delete cascade,
  request_ip_hash text,
  attempt_ip_hash text,
  attempts_count integer not null default 0,
  max_attempts integer not null default 5,
  last_sent_at timestamptz not null default now(),
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_conf_verif_challenges_lookup
  on public.conference_verification_challenges(conference_edition_id, email_hash, created_at desc);

create index if not exists idx_conf_verif_challenges_expires
  on public.conference_verification_challenges(expires_at);

create index if not exists idx_conf_verif_challenges_ip
  on public.conference_verification_challenges(request_ip_hash, created_at desc);

comment on table public.conference_verification_challenges is
  'Ephemeral OTP challenges for corresponding author verification and anti-abuse protection.';

-- 2. Conference Bank Transfers (Orthogonal wire transfers with UTR uniqueness)
create table if not exists public.conference_bank_transfers (
  id uuid primary key default gen_random_uuid(),
  conference_edition_id uuid not null references public.conference_editions(id) on delete cascade,
  registration_id uuid not null references public.conference_registrations(id) on delete cascade,
  utr_number text not null,
  utr_normalized text not null,
  transfer_amount numeric(12,2) not null,
  currency text not null default 'INR',
  bank_name text,
  depositor_name text not null,
  transfer_date date not null default current_date,
  receipt_storage_path text,
  receipt_file_name text,
  receipt_content_type text,
  receipt_size_bytes integer,
  transfer_status text not null default 'submitted'
    check (transfer_status in ('submitted','awaiting_verification','approved','rejected','reversed')),
  review_notes text,
  reviewed_by text,
  reviewed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (conference_edition_id, utr_normalized)
);

create index if not exists idx_conf_bank_transfers_reg
  on public.conference_bank_transfers(registration_id);

create index if not exists idx_conf_bank_transfers_edition_status
  on public.conference_bank_transfers(conference_edition_id, transfer_status, created_at desc);

comment on table public.conference_bank_transfers is
  'Bank transfer reconciliation records with receipt attachments and organizer review status.';

-- 3. Enhance Conference People with publishing, biography, and role attributes
alter table public.conference_people
  add column if not exists is_published boolean not null default false,
  add column if not exists bio text,
  add column if not exists avatar_url text,
  add column if not exists role text default 'speaker'
    check (role in ('speaker', 'keynote', 'committee', 'panelist', 'session_chair', 'organizer', 'attendee')),
  add column if not exists display_order integer not null default 0,
  add column if not exists social_links jsonb not null default '{}'::jsonb;

create index if not exists idx_conf_people_published
  on public.conference_people(conference_edition_id, is_published, display_order asc);

-- 4. Private Storage Bucket for Bank Transfer Receipts
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('conference-bank-receipts', 'conference-bank-receipts', false, 5242880, array['application/pdf','image/jpeg','image/png'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- 5. Row-Level Security
alter table public.conference_verification_challenges enable row level security;
alter table public.conference_bank_transfers enable row level security;
alter table public.conference_people enable row level security;

-- Drop and recreate public read policy for published people
drop policy if exists "Public can view published conference people" on public.conference_people;
create policy "Public can view published conference people"
  on public.conference_people
  for select
  using (is_published = true);

-- Verification challenges and bank transfers are private and only accessible via service role / backend API
drop policy if exists "No direct public access to verification challenges" on public.conference_verification_challenges;
create policy "No direct public access to verification challenges"
  on public.conference_verification_challenges
  for all
  using (false);

drop policy if exists "No direct public access to bank transfers" on public.conference_bank_transfers;
create policy "No direct public access to bank transfers"
  on public.conference_bank_transfers
  for all
  using (false);
