/**
 * ScholarVault Configuration-Driven Conference Platform
 * Orthogonal Registration Lifecycle State Machine
 *
 * Enforces explicit separation across:
 * - transfer_status: Offline wire reconciliation lifecycle
 * - payment_status: Financial settlement state
 * - registration_status: Delegate admittance state
 */

export type TransferStatus =
  | "submitted"
  | "awaiting_verification"
  | "approved"
  | "rejected"
  | "reversed";

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

export type RegistrationStatus = "pending" | "confirmed" | "cancelled";

export interface RegistrationLifecycleState {
  transferStatus?: TransferStatus | null;
  paymentStatus: PaymentStatus;
  registrationStatus: RegistrationStatus;
}

export type TransferAction = "submit" | "under_review" | "approve" | "reject" | "reverse";
export type PaymentAction = "checkout_opened" | "settled" | "failed" | "cancelled" | "refund";

const VALID_TRANSFER_TRANSITIONS: Record<TransferStatus, TransferStatus[]> = {
  submitted: ["awaiting_verification", "approved", "rejected"],
  awaiting_verification: ["approved", "rejected"],
  approved: ["reversed"],
  rejected: ["submitted"], // Allow re-submission with corrected UTR/receipt
  reversed: [],
};

const VALID_PAYMENT_TRANSITIONS: Record<PaymentStatus, PaymentStatus[]> = {
  not_started: ["awaiting_payment", "awaiting_verification", "paid", "waived", "cancelled"],
  awaiting_payment: ["paid", "failed", "cancelled", "awaiting_verification"],
  awaiting_verification: ["paid", "failed", "cancelled"],
  paid: ["refund_pending", "refunded"],
  waived: ["cancelled"],
  failed: ["awaiting_payment", "awaiting_verification", "cancelled"],
  cancelled: [],
  refund_pending: ["refunded", "paid"],
  refunded: [],
};

const VALID_REGISTRATION_TRANSITIONS: Record<RegistrationStatus, RegistrationStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["cancelled"],
  cancelled: [],
};

export function canTransitionTransfer(current: TransferStatus, next: TransferStatus): boolean {
  if (current === next) return true;
  return VALID_TRANSFER_TRANSITIONS[current]?.includes(next) ?? false;
}

export function canTransitionPayment(current: PaymentStatus, next: PaymentStatus): boolean {
  if (current === next) return true;
  return VALID_PAYMENT_TRANSITIONS[current]?.includes(next) ?? false;
}

export function canTransitionRegistration(
  current: RegistrationStatus,
  next: RegistrationStatus
): boolean {
  if (current === next) return true;
  return VALID_REGISTRATION_TRANSITIONS[current]?.includes(next) ?? false;
}

/**
 * Pure state transition function for Bank Wire actions.
 * Guarantees that financial and registration states evolve predictably.
 */
export function applyTransferAction(
  current: RegistrationLifecycleState,
  action: TransferAction
): RegistrationLifecycleState {
  switch (action) {
    case "submit": {
      if (current.paymentStatus === "paid" || current.registrationStatus === "confirmed") {
        throw new Error("Cannot submit bank wire for an already confirmed registration.");
      }
      return {
        transferStatus: "submitted",
        paymentStatus: "awaiting_verification",
        registrationStatus: "pending",
      };
    }
    case "under_review": {
      if (current.transferStatus !== "submitted") {
        throw new Error(`Cannot place transfer under review from status ${current.transferStatus}.`);
      }
      return {
        ...current,
        transferStatus: "awaiting_verification",
      };
    }
    case "approve": {
      if (current.transferStatus !== "submitted" && current.transferStatus !== "awaiting_verification") {
        throw new Error(`Cannot approve bank transfer with status ${current.transferStatus}.`);
      }
      return {
        transferStatus: "approved",
        paymentStatus: "paid",
        registrationStatus: "confirmed",
      };
    }
    case "reject": {
      if (current.transferStatus !== "submitted" && current.transferStatus !== "awaiting_verification") {
        throw new Error(`Cannot reject bank transfer with status ${current.transferStatus}.`);
      }
      return {
        transferStatus: "rejected",
        paymentStatus: "failed",
        registrationStatus: "pending",
      };
    }
    case "reverse": {
      if (current.transferStatus !== "approved") {
        throw new Error(`Cannot reverse a bank transfer that is not approved.`);
      }
      return {
        transferStatus: "reversed",
        paymentStatus: "refunded",
        registrationStatus: "cancelled",
      };
    }
    default:
      throw new Error(`Unknown transfer action: ${String(action)}`);
  }
}

/**
 * Pure state transition function for Online Gateway actions (Omniware / Dodo).
 */
export function applyPaymentAction(
  current: RegistrationLifecycleState,
  action: PaymentAction
): RegistrationLifecycleState {
  switch (action) {
    case "checkout_opened": {
      if (current.paymentStatus === "paid") {
        return current;
      }
      return {
        ...current,
        paymentStatus: "awaiting_payment",
      };
    }
    case "settled": {
      return {
        ...current,
        paymentStatus: "paid",
        registrationStatus: "confirmed",
      };
    }
    case "failed": {
      if (current.paymentStatus === "paid") {
        return current; // Don't downgrade a confirmed payment on a late webhook failure
      }
      return {
        ...current,
        paymentStatus: "failed",
        registrationStatus: "pending",
      };
    }
    case "cancelled": {
      return {
        ...current,
        paymentStatus: "cancelled",
        registrationStatus: "cancelled",
      };
    }
    case "refund": {
      return {
        ...current,
        paymentStatus: "refunded",
        registrationStatus: "cancelled",
      };
    }
    default:
      throw new Error(`Unknown payment action: ${String(action)}`);
  }
}
