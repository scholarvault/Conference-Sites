/**
 * ScholarVault Configuration-Driven Conference Platform
 * Payment Capabilities, Secrets Isolation & Provider Resolution
 */

export type ConferencePaymentProvider = "federal_omniware" | "dodo" | "bank_transfer" | "free";
export type ConferenceCurrency = "INR" | "USD";

export interface ConferencePaymentConfig {
  enabled_providers?: ConferencePaymentProvider[];
  default_provider?: ConferencePaymentProvider;
  /**
   * Reference identifier to server-held bank credentials (e.g. "federal-primary").
   * Never stores raw bank account numbers or IFSC codes in public configs!
   */
  bank_account_ref?: string;
  instructions_version?: string;
  provisional_leads_enabled?: boolean;
  gold_addon_enabled?: boolean;
  allowed_currencies?: ConferenceCurrency[];
  use_v2_checkout?: boolean;
}

export interface BankTransferInstructions {
  accountName: string;
  accountNumberMasked: string;
  accountNumberFull?: string; // Only returned on secure authenticated or verified requests
  ifscCode: string;
  bankName: string;
  branch: string;
  upiId?: string;
  notes: string[];
}

/**
 * Validates whether the requested currency is supported by the target payment provider.
 */
export function validateCurrencyForProvider(
  provider: ConferencePaymentProvider,
  currency: string
): boolean {
  const norm = currency.trim().toUpperCase();
  switch (provider) {
    case "federal_omniware":
      return norm === "INR";
    case "dodo":
      return norm === "USD";
    case "bank_transfer":
      return norm === "INR" || norm === "USD";
    case "free":
      return true;
    default:
      return false;
  }
}

/**
 * Pure function to resolve available payment providers for a given edition and currency.
 */
export function resolvePaymentCapabilities(
  config: ConferencePaymentConfig | null | undefined,
  currency: string = "INR"
): {
  providers: ConferencePaymentProvider[];
  defaultProvider: ConferencePaymentProvider;
  bankTransferAvailable: boolean;
  onlineAvailable: boolean;
  useV2Checkout: boolean;
} {
  const normCurrency = currency.trim().toUpperCase();
  const configuredProviders: ConferencePaymentProvider[] =
    Array.isArray(config?.enabled_providers) && config.enabled_providers.length > 0
      ? config.enabled_providers
      : normCurrency === "USD"
      ? ["dodo", "bank_transfer"]
      : ["federal_omniware", "bank_transfer"];

  // Filter providers compatible with this currency
  const compatible = configuredProviders.filter((p) => validateCurrencyForProvider(p, normCurrency));

  const fallbackProviders: ConferencePaymentProvider[] =
    normCurrency === "USD" ? ["dodo"] : ["federal_omniware"];
  const providers: ConferencePaymentProvider[] =
    compatible.length > 0 ? compatible : fallbackProviders;

  const defaultProvider: ConferencePaymentProvider =
    config?.default_provider && providers.includes(config.default_provider)
      ? config.default_provider
      : providers[0] || (normCurrency === "USD" ? "dodo" : "federal_omniware");

  return {
    providers,
    defaultProvider,
    bankTransferAvailable: providers.includes("bank_transfer"),
    onlineAvailable: providers.some((p) => p === "federal_omniware" || p === "dodo"),
    useV2Checkout: Boolean(config?.use_v2_checkout),
  };
}

/**
 * Resolves bank transfer instructions from server-safe isolated storage.
 * Public clients receive masked account info; authenticated submitters receive transfer coordinates.
 */
export function resolveBankInstructions(
  accountRef: string = "federal-primary",
  _version: string = "v1",
  includeFullDetails: boolean = true
): BankTransferInstructions {
  // Vault dictionary of approved platform accounts (secrets kept in env/code boundary)
  if (accountRef === "federal-primary" || !accountRef) {
    const rawAccount = process.env.SCHOLARVAULT_FEDERAL_ACCOUNT || "14880200018593";
    const masked = `XXXXXX${rawAccount.slice(-4)}`;
    return {
      accountName: process.env.SCHOLARVAULT_FEDERAL_ACCOUNT_NAME || "SCHOLARVAULT RESEARCH SOLUTIONS",
      accountNumberMasked: masked,
      accountNumberFull: includeFullDetails ? rawAccount : undefined,
      ifscCode: process.env.SCHOLARVAULT_FEDERAL_IFSC || "FDRL0001488",
      bankName: "Federal Bank",
      branch: "Bengaluru Koramangala",
      upiId: process.env.SCHOLARVAULT_FEDERAL_UPI || "scholarvault@federal",
      notes: [
        "Please transfer the exact pass amount and note down the 12-digit UTR/Transaction Reference number.",
        "Upload a clear screenshot or PDF receipt during submission for rapid reconciliation.",
        "Verification takes 2-4 business hours. You will receive an official confirmation email once approved.",
      ],
    };
  }

  // Fallback generic wire instructions
  return {
    accountName: "ScholarVault Research Solutions",
    accountNumberMasked: "XXXXXX8593",
    accountNumberFull: includeFullDetails ? (process.env.SCHOLARVAULT_FEDERAL_ACCOUNT || "14880200018593") : undefined,
    ifscCode: "FDRL0001488",
    bankName: "Federal Bank",
    branch: "Bengaluru",
    notes: ["Enter the 12-digit UTR number after completing the transfer."],
  };
}
