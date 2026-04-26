import type { Provider } from "@/types";

/**
 * Provider database with prefix mappings for Indonesian carriers.
 */
export const PROVIDERS: Provider[] = [
  {
    id: "telkomsel",
    name: "Telkomsel",
    code: "TSEL",
    prefixes: [
      "0811",
      "0812",
      "0813",
      "0821",
      "0822",
      "0823",
      "0851",
      "0852",
      "0853",
    ],
    color: "#e11d48",
    icon: "📡",
  },
  {
    id: "xl",
    name: "XL Axiata",
    code: "XL",
    prefixes: ["0817", "0818", "0819", "0859", "0878", "0877"],
    color: "#0369a1",
    icon: "📶",
  },
  {
    id: "indosat",
    name: "Indosat Ooredoo",
    code: "ISAT",
    prefixes: ["0814", "0815", "0816", "0855", "0856", "0857", "0858"],
    color: "#eab308",
    icon: "📱",
  },
  {
    id: "tri",
    name: "Tri (3)",
    code: "TRI",
    prefixes: ["0895", "0896", "0897", "0898", "0899"],
    color: "#7c3aed",
    icon: "📲",
  },
  {
    id: "smartfren",
    name: "Smartfren",
    code: "SMFR",
    prefixes: ["0881", "0882", "0883", "0884", "0885", "0886", "0887", "0888"],
    color: "#dc2626",
    icon: "🔗",
  },
];

/**
 * Normalize phone number to standard 08xx format.
 */
function normalizePhone(phone: string): string {
  let cleaned = phone.replace(/[\s\-\(\)]/g, "");
  if (cleaned.startsWith("+62")) {
    cleaned = "0" + cleaned.slice(3);
  } else if (cleaned.startsWith("62")) {
    cleaned = "0" + cleaned.slice(2);
  }
  return cleaned;
}

/**
 * Validate Indonesian phone number format.
 */
export function isValidPhone(phone: string): boolean {
  const normalized = normalizePhone(phone);
  return /^08\d{8,13}$/.test(normalized);
}

/**
 * Detect provider from phone number prefix.
 * Works with partial phone numbers (just the prefix) for real-time detection.
 * Returns the Provider or null if not recognized.
 */
export function detectProvider(phone: string): Provider | null {
  const normalized = normalizePhone(phone);

  // Only need 4 digits starting with 08 to detect
  if (normalized.length < 4 || !normalized.startsWith("08")) return null;

  const prefix4 = normalized.slice(0, 4);

  for (const provider of PROVIDERS) {
    if (provider.prefixes.includes(prefix4)) {
      return provider;
    }
  }

  return null;
}

/**
 * Get provider by ID.
 */
export function getProviderById(id: string): Provider | undefined {
  return PROVIDERS.find((p) => p.id === id);
}
