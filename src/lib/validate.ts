/** Shared validation. Used by both the client editor and the server on publish. */

const SAFE_PROTOCOLS = new Set(["http:", "https:", "mailto:"]);

/**
 * Normalize a user-entered link target to a safe absolute URL.
 *
 * Link hrefs come straight from user input and render into anchors on a
 * public page, so anything that isn't an allow-listed protocol is rejected
 * outright — `javascript:`, `data:`, and `vbscript:` are script-execution
 * vectors, not typos to be repaired.
 */
export function normalizeUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // Bare domains ("example.com/x") are the common case; assume https.
  const candidate = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return null;
  }

  if (!SAFE_PROTOCOLS.has(url.protocol)) return null;
  if (url.protocol !== "mailto:" && !url.hostname.includes(".")) return null;

  return url.toString();
}

export function isValidUrl(raw: string): boolean {
  return normalizeUrl(raw) !== null;
}

/**
 * Deliberately loose. The only thing worth rejecting here is input that
 * plainly isn't an address; anything stricter starts turning away valid,
 * deliverable mail, and the real proof an address works is a delivered email.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/;

export function validateEmail(raw: string): {
  ok: boolean;
  value: string;
  error?: string;
} {
  const value = raw.trim().toLowerCase();

  if (!value) return { ok: false, value, error: "Enter your email." };
  if (value.length > 254)
    return { ok: false, value, error: "That email is too long." };
  if (!EMAIL_RE.test(value))
    return { ok: false, value, error: "That doesn't look like an email." };

  return { ok: true, value };
}

const USERNAME_RE = /^[a-z0-9](?:[a-z0-9-]{1,28}[a-z0-9])$/;

/**
 * Reserved because these collide with real app routes — a user page at
 * /dashboard would shadow the dashboard. Not a profanity or brand list;
 * the PRD explicitly scopes those out of the MVP.
 */
export const RESERVED_USERNAMES = new Set([
  "api",
  "auth",
  "create",
  "dashboard",
  "demo",
  "go",
  "login",
  "logout",
  "signin",
  "signout",
  "settings",
  "admin",
  "about",
  "terms",
  "privacy",
  "_next",
  "static",
  "public",
  "slinky",
  "www",
]);

export function validateUsername(raw: string): {
  ok: boolean;
  value: string;
  error?: string;
} {
  const value = raw.trim().toLowerCase();

  if (!value) return { ok: false, value, error: "Pick a username." };
  if (value.length < 3)
    return { ok: false, value, error: "At least 3 characters." };
  if (value.length > 30)
    return { ok: false, value, error: "30 characters max." };
  if (!USERNAME_RE.test(value))
    return {
      ok: false,
      value,
      error: "Lowercase letters, numbers and dashes only. No leading or trailing dash.",
    };
  if (RESERVED_USERNAMES.has(value))
    return { ok: false, value, error: "That one's reserved. Try another." };

  return { ok: true, value };
}

export function validateLinkTitle(raw: string): string | undefined {
  const value = raw.trim();
  if (!value) return "Give the link a title.";
  if (value.length > 80) return "80 characters max.";
  return undefined;
}

/** Hex colors are written into inline styles, so constrain them strictly. */
export function isHexColor(value: string): boolean {
  return /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value);
}

export function safeHex(value: string, fallback: string): string {
  return isHexColor(value) ? value : fallback;
}
