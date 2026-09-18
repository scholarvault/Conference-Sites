export type ConferenceSystemRole = "researcher" | "reviewer" | "organizer" | "admin";
export type ParticipationType = "presenter" | "co_author" | "delegate" | "listener" | "speaker" | "committee" | "guest";
export type SubmissionStatus = "draft" | "submitted" | "withdrawn";
export type ScreeningStatus = "pending" | "passed" | "revision_required" | "failed";
export type ReviewStatus = "unassigned" | "assigned" | "in_progress" | "completed";
export type DecisionStatus = "pending" | "accepted" | "minor_revision" | "major_revision" | "rejected";
export type PaymentStatus =
  | "not_started"
  | "awaiting_payment"
  | "awaiting_verification"
  | "paid"
  | "waived"
  | "failed"
  | "cancelled"
  | "refund_pending"
  | "refunded";
export type TransferStatus =
  | "submitted"
  | "awaiting_verification"
  | "approved"
  | "rejected"
  | "reversed";
export type ParticipationStatus = "registered" | "checked_in" | "attended" | "presented" | "no_show";
export type CredentialStatus = "pending_eligibility" | "eligible" | "issued" | "revoked";

export type ConferencePaymentProvider = "federal_omniware" | "dodo" | "bank_transfer" | "free";
export type ConferenceCurrency = "INR" | "USD";

export interface ConferencePaymentConfig {
  enabled_providers?: ConferencePaymentProvider[];
  default_provider?: ConferencePaymentProvider;
  bank_account_ref?: string;
  instructions_version?: string;
  provisional_leads_enabled?: boolean;
  gold_addon_enabled?: boolean;
  allowed_currencies?: ConferenceCurrency[];
  use_v2_checkout?: boolean;
}

export interface AuthorVerificationTokenPayload {
  challengeId: string;
  verifiedEmailHash: string;
  editionId: string;
  selectedSubmissionId: string;
  purpose: "conference_author_registration";
  exp: number;
}

export interface BankTransferRecord {
  id: string;
  conference_edition_id: string;
  registration_id: string;
  utr_number: string;
  utr_normalized: string;
  transfer_amount: number;
  currency: string;
  bank_name?: string | null;
  depositor_name: string;
  transfer_date: string;
  receipt_storage_path?: string | null;
  receipt_file_name?: string | null;
  receipt_content_type?: string | null;
  receipt_size_bytes?: number | null;
  transfer_status: TransferStatus;
  review_notes?: string | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ConferencePersonSummary {
  id: string;
  conference_edition_id: string;
  display_name: string;
  email: string;
  user_id?: string | null;
  institution?: string | null;
  country?: string | null;
  role?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  is_published: boolean;
  display_order: number;
  social_links?: Record<string, string>;
  identity_status: string;
  claimed_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConferenceEditionSummary {
  id: string;
  name: string;
  short_name?: string | null;
  slug: string;
  year?: number | null;
  status: string;
  delivery_mode: "physical" | "virtual" | "hybrid";
  starts_at?: string | null;
  ends_at?: string | null;
  submission_closes_at?: string | null;
  registration_closes_at?: string | null;
  city?: string | null;
  country?: string | null;
  brand_config?: Record<string, unknown>;
  payment_config?: ConferencePaymentConfig;
  allowed_embed_origins?: string[];
  website_url?: string | null;
  series?: { name: string; acronym?: string | null } | null;
  organization?: { name: string; slug: string } | null;
}

export interface ConferenceSubmissionSummary {
  id: string;
  conference_edition_id: string;
  submission_number: string;
  title: string;
  submission_type: string;
  submission_status: SubmissionStatus;
  screening_status: ScreeningStatus;
  review_status: ReviewStatus;
  decision_status: DecisionStatus;
  submitted_at?: string | null;
  updated_at: string;
  edition?: ConferenceEditionSummary | null;
}

export interface ConferenceRegistrationSummary {
  id: string;
  conference_edition_id: string;
  registration_number: string;
  participant_type: ParticipationType;
  participation_mode: "physical" | "virtual";
  payment_status: PaymentStatus;
  registration_status: "pending" | "confirmed" | "cancelled";
  amount_due: number;
  currency: string;
  edition?: ConferenceEditionSummary | null;
  bank_transfer?: BankTransferRecord | null;
}

export interface ConferenceCredentialSummary {
  id: string;
  credential_number: string;
  credential_type: string;
  title: string;
  recipient_name: string;
  status: CredentialStatus;
  issued_at?: string | null;
  edition?: ConferenceEditionSummary | null;
}

export interface ConferenceWorkspaceData {
  editions: ConferenceEditionSummary[];
  availableEditions: ConferenceEditionSummary[];
  submissions: ConferenceSubmissionSummary[];
  registrations: ConferenceRegistrationSummary[];
  credentials: ConferenceCredentialSummary[];
  reviewerAssignments: unknown[];
  organizerMemberships: unknown[];
  platformAdmin?: boolean;
  setupRequired?: boolean;
}

export interface ConfigurableFormField {
  id: string;
  type: "text" | "textarea" | "select" | "radio" | "checkbox" | "date" | "file";
  label: string;
  description?: string;
  required?: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
  validation?: { minLength?: number; maxLength?: number };
}
