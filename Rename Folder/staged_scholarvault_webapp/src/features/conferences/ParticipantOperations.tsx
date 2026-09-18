"use client";

/* eslint-disable @typescript-eslint/no-explicit-any -- Participant rows combine registration, attendance and credential relations. */
/* eslint-disable react-hooks/set-state-in-effect -- Participant operations are intentionally hydrated from the authenticated API. */

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  Search,
  UserCheck,
  Building2,
  FileText,
  XCircle,
  ExternalLink,
  Check,
  Clock,
} from "lucide-react";

export default function ParticipantOperations({ slug }: { slug: string }) {
  const [edition, setEdition] = useState<any>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [transfers, setTransfers] = useState<any[]>([]);
  const [transferCounts, setTransferCounts] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState<"participants" | "transfers">("participants");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");

  const load = useCallback(async () => {
    const [partRes, transRes] = await Promise.all([
      fetch(`/api/conferences/organizer/${slug}/participants`, { cache: "no-store" }),
      fetch(`/api/conferences/organizer/${slug}/bank-transfers`, { cache: "no-store" }),
    ]);

    const partResult = await partRes.json();
    const transResult = await transRes.json();

    if (!partRes.ok) {
      setError(partResult.error || "Participants could not be loaded");
    } else {
      setEdition(partResult.edition);
      setRegistrations(partResult.registrations || []);
      setError("");
    }

    if (transRes.ok) {
      setTransfers(transResult.transfers || []);
      setTransferCounts(transResult.counts || {});
    }
  }, [slug]);

  useEffect(() => {
    load();
  }, [load]);

  const visibleParticipants = useMemo(
    () =>
      registrations.filter((item) =>
        `${item.registration_number} ${item.attendee_snapshot?.name} ${item.attendee_snapshot?.email}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [registrations, query]
  );

  const visibleTransfers = useMemo(
    () =>
      transfers.filter((item) =>
        `${item.utr_number} ${item.depositor_name} ${item.registration?.registration_number}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [transfers, query]
  );

  const mutateParticipant = async (registrationId: string, body: Record<string, unknown>) => {
    setBusy(registrationId);
    const response = await fetch(`/api/conferences/organizer/${slug}/participants`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ registration_id: registrationId, ...body }),
    });
    const result = await response.json();
    if (!response.ok) setError(result.error || "Action failed");
    else await load();
    setBusy("");
  };

  const reviewTransfer = async (transferId: string, action: "approve" | "reject", notes?: string) => {
    setBusy(transferId);
    const response = await fetch(`/api/conferences/organizer/${slug}/bank-transfers/${transferId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, notes }),
    });
    const result = await response.json();
    if (!response.ok) setError(result.error || "Transfer review action failed");
    else await load();
    setBusy("");
  };

  if (!edition) {
    return (
      <div className="mx-auto grid min-h-[60vh] place-items-center px-5 text-sm font-semibold text-[var(--text-secondary)]">
        {error || "Loading conference operations..."}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8 md:px-8 md:py-10">
      <Link
        href={`/organizer/editions/${slug}`}
        className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-[var(--text-secondary)]"
      >
        <ArrowLeft size={16} /> Conference operations
      </Link>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--text-primary)] md:text-3xl">
            {edition.name} Operations
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Delegate check-ins, credential issuance, and bank wire reconciliation.
          </p>
        </div>

        {/* Tab navigation */}
        <div className="inline-flex rounded-xl border border-[var(--border)] bg-[var(--surface-base)] p-1">
          <button
            onClick={() => setActiveTab("participants")}
            className={`rounded-lg px-4 py-2 text-xs font-black transition-all ${
              activeTab === "participants"
                ? "bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-sm"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            Delegates ({registrations.length})
          </button>
          <button
            onClick={() => setActiveTab("transfers")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-black transition-all ${
              activeTab === "transfers"
                ? "bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-sm"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            Bank Wire Queue ({transfers.length})
            {(transferCounts.awaiting_verification || transferCounts.submitted || 0) > 0 && (
              <span className="grid h-4 min-w-4 place-items-center rounded-full bg-amber-500 px-1 text-[10px] text-white">
                {(transferCounts.awaiting_verification || 0) + (transferCounts.submitted || 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-xs font-bold text-red-600">
          {error}
        </div>
      )}

      {/* Search Filter */}
      <div className="mt-6 flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-base)] px-4 py-3">
        <Search size={18} className="text-[var(--text-tertiary)]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            activeTab === "participants"
              ? "Search by registration number, delegate name, or email..."
              : "Search by UTR number, depositor name, or registration number..."
          }
          className="w-full bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)]"
        />
      </div>

      {/* View 1: Delegates Roster */}
      {activeTab === "participants" && (
        <div className="mt-5 space-y-3">
          {visibleParticipants.map((registration) => (
            <ParticipantRow
              key={registration.id}
              registration={registration}
              busy={busy === registration.id}
              mutate={mutateParticipant}
            />
          ))}
          {visibleParticipants.length === 0 && (
            <div className="py-12 text-center text-sm font-semibold text-[var(--text-secondary)]">
              No participants found matching &ldquo;{query}&rdquo;.
            </div>
          )}
        </div>
      )}

      {/* View 2: Bank Transfers Queue */}
      {activeTab === "transfers" && (
        <div className="mt-5 space-y-3">
          {visibleTransfers.map((transfer) => (
            <BankTransferRow
              key={transfer.id}
              transfer={transfer}
              busy={busy === transfer.id}
              onReview={reviewTransfer}
            />
          ))}
          {visibleTransfers.length === 0 && (
            <div className="py-12 text-center text-sm font-semibold text-[var(--text-secondary)]">
              No bank transfers found matching &ldquo;{query}&rdquo;.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ParticipantRow({
  registration,
  busy,
  mutate,
}: {
  registration: any;
  busy: boolean;
  mutate: (id: string, body: Record<string, unknown>) => Promise<void>;
}) {
  const participant = registration.participant;
  const credential = participant?.credentials?.[0];

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-base)] p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-black text-[var(--text-primary)]">
              {registration.registration_number}
            </span>
            <span className="rounded-full bg-[var(--surface-highlight)] px-2.5 py-0.5 text-xs font-bold text-[var(--text-secondary)]">
              {registration.category?.name || registration.participant_type}
            </span>
            {participant?.participation_status && (
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                {participant.participation_status}
              </span>
            )}
          </div>
          <div className="mt-1 text-sm font-bold text-[var(--text-primary)]">
            {registration.attendee_snapshot?.name || "Anonymous Participant"}
          </div>
          <div className="text-xs text-[var(--text-secondary)]">
            {registration.attendee_snapshot?.email} · {registration.attendee_snapshot?.institution || "Independent"}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!participant ? (
            <button
              disabled={busy}
              onClick={() => mutate(registration.id, { action: "confirm_attendance" })}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 text-xs font-black text-[var(--text-primary)] hover:bg-[var(--surface-highlight)] disabled:opacity-40"
            >
              <UserCheck size={15} /> Check in
            </button>
          ) : (
            <>
              <SmallButton
                disabled={busy}
                label="Checked in"
                onClick={() =>
                  mutate(registration.id, {
                    action: "participation",
                    status: "checked_in",
                  })
                }
              />
              <SmallButton
                disabled={busy}
                label="Attended"
                onClick={() =>
                  mutate(registration.id, {
                    action: "participation",
                    status: "attended",
                  })
                }
              />
              <SmallButton
                disabled={busy}
                label="Presented"
                onClick={() =>
                  mutate(registration.id, {
                    action: "participation",
                    status: "presented",
                  })
                }
              />
            </>
          )}
          {participant && !credential && (
            <button
              disabled={busy}
              onClick={() =>
                mutate(registration.id, {
                  action: "issue_credential",
                  credential_type:
                    participant.participation_status === "presented"
                      ? "presentation"
                      : "participation",
                })
              }
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[var(--text-primary)] px-3 text-xs font-black text-[var(--bg-primary)] disabled:opacity-40"
            >
              <Award size={15} /> Issue credential
            </button>
          )}
          {credential && (
            <Link
              href={`/credentials/${credential.credential_number}`}
              target="_blank"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 text-xs font-black text-emerald-700"
            >
              <CheckCircle2 size={15} /> {credential.credential_number}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function BankTransferRow({
  transfer,
  busy,
  onReview,
}: {
  transfer: any;
  busy: boolean;
  onReview: (id: string, action: "approve" | "reject", notes?: string) => Promise<void>;
}) {
  const isPending =
    transfer.transfer_status === "submitted" || transfer.transfer_status === "awaiting_verification";

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-base)] p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-500/10 text-blue-600">
          <Building2 size={19} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-black text-[var(--text-primary)]">
              UTR: {transfer.utr_number}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                transfer.transfer_status === "approved"
                  ? "bg-emerald-500/10 text-emerald-700"
                  : transfer.transfer_status === "rejected"
                  ? "bg-red-500/10 text-red-700"
                  : "bg-amber-500/10 text-amber-800"
              }`}
            >
              {transfer.transfer_status.replace("_", " ")}
            </span>
          </div>
          <div className="mt-1 text-xs text-[var(--text-secondary)]">
            Depositor: <strong>{transfer.depositor_name}</strong> · Amount:{" "}
            <strong>
              {transfer.currency === "INR" ? "₹" : "$"}
              {Number(transfer.transfer_amount).toLocaleString()}
            </strong>{" "}
            · Reg: {transfer.registration?.registration_number || "Direct Wire"}
          </div>
          {transfer.review_notes && (
            <div className="mt-1 text-xs italic text-[var(--text-tertiary)]">
              Note: {transfer.review_notes}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {transfer.signed_receipt_url && (
            <a
              href={transfer.signed_receipt_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 text-xs font-black text-[var(--text-primary)] hover:bg-[var(--surface-highlight)]"
            >
              <FileText size={15} /> Receipt <ExternalLink size={12} />
            </a>
          )}

          {isPending && (
            <>
              <button
                disabled={busy}
                onClick={() => onReview(transfer.id, "approve")}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-emerald-600 px-3 text-xs font-black text-white hover:bg-emerald-700 disabled:opacity-40"
              >
                <Check size={15} /> Approve
              </button>
              <button
                disabled={busy}
                onClick={() => {
                  const reason = window.prompt("Reason for rejecting this bank transfer (optional):");
                  if (reason !== null) {
                    onReview(transfer.id, "reject", reason);
                  }
                }}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-red-300 bg-red-50 px-3 text-xs font-black text-red-700 hover:bg-red-100 disabled:opacity-40"
              >
                <XCircle size={15} /> Reject
              </button>
            </>
          )}

          {!isPending && (
            <div className="flex items-center gap-1 text-xs font-bold text-[var(--text-tertiary)]">
              <Clock size={14} /> Reviewed
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SmallButton({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="h-9 rounded-lg border border-[var(--border)] px-3 text-xs font-black text-[var(--text-primary)] disabled:opacity-40"
    >
      {label}
    </button>
  );
}
