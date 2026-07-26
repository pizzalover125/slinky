import { THEMES } from "@/lib/themes";
import {
  DEFAULT_CUSTOMIZATION,
  MAX_LINKS_PER_PAGE,
  type BackgroundChoice,
  type Customization,
  type DraftPage,
  type PatternId,
  type SlinkyLink,
} from "@/lib/types";
import { isHexColor, normalizeUrl, validateUsername } from "@/lib/validate";

/**
 * The draft is built entirely client-side and posted up at publish time,
 * so nothing in it can be trusted. Everything below re-derives a known-good
 * value or drops the field — no pass-through.
 */

const PATTERNS = new Set<PatternId>([
  "dots",
  "grid",
  "stripes",
  "checks",
  "zigzag",
]);

function cleanHex(value: unknown, fallback: string | null): string | null {
  return typeof value === "string" && isHexColor(value)
    ? value.toUpperCase()
    : fallback;
}

function cleanBackground(input: unknown): BackgroundChoice {
  if (!input || typeof input !== "object") return { type: "theme" };
  const bg = input as Record<string, unknown>;

  if (bg.type === "solid") {
    const color = cleanHex(bg.color, null);
    return color ? { type: "solid", color } : { type: "theme" };
  }

  if (bg.type === "pattern") {
    const color = cleanHex(bg.color, null);
    const on = cleanHex(bg.on, null);
    const pattern = bg.pattern as PatternId;
    if (color && on && PATTERNS.has(pattern)) {
      return { type: "pattern", pattern, color, on };
    }
    return { type: "theme" };
  }

  return { type: "theme" };
}

export function sanitizeCustomization(input: unknown): Customization {
  if (!input || typeof input !== "object") return { ...DEFAULT_CUSTOMIZATION };
  const c = input as Record<string, unknown>;

  return {
    accent: cleanHex(c.accent, null),
    border: cleanHex(c.border, null),
    background: cleanBackground(c.background),
  };
}

export function sanitizeThemeId(input: unknown): string {
  return typeof input === "string" && THEMES.some((t) => t.id === input)
    ? input
    : THEMES[0].id;
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type SanitizedLink = Pick<
  SlinkyLink,
  "title" | "url" | "active" | "position"
> & {
  /**
   * Carried through from the client so an update can match a row to its
   * existing record — that's what preserves click counts across a rename
   * or a reorder. Absent for links created in this session.
   */
  id?: string;
};

export interface SanitizedDraft {
  username: string;
  themeId: string;
  displayName: string;
  bio: string;
  avatarUrl: string | null;
  customization: Customization;
  links: SanitizedLink[];
}

export type SanitizeResult =
  | { ok: true; value: SanitizedDraft }
  | { ok: false; error: string };

export function sanitizeDraft(input: unknown): SanitizeResult {
  if (!input || typeof input !== "object") {
    return { ok: false, error: "Nothing to publish." };
  }
  const draft = input as Partial<DraftPage>;

  const username = validateUsername(String(draft.username ?? ""));
  if (!username.ok) {
    return { ok: false, error: username.error ?? "Invalid username." };
  }

  const profile = (draft.profile ?? {}) as Record<string, unknown>;
  const displayName = String(profile.displayName ?? "").trim().slice(0, 50);
  const bio = String(profile.bio ?? "").trim().slice(0, 160);

  // An avatar URL renders into an <img src>, so hold it to the same
  // protocol allow-list as link hrefs.
  const rawAvatar = profile.avatarUrl;
  const avatarUrl =
    typeof rawAvatar === "string" && rawAvatar.trim()
      ? normalizeUrl(rawAvatar)
      : null;

  const rawLinks = Array.isArray(draft.links) ? draft.links : [];
  const links: SanitizedLink[] = [];

  for (const raw of rawLinks) {
    if (!raw || typeof raw !== "object") continue;
    const title = String(raw.title ?? "").trim().slice(0, 80);
    const url = normalizeUrl(String(raw.url ?? ""));

    // Half-filled rows are a normal editor state, not an error — drop them
    // rather than blocking the publish.
    if (!title || !url) continue;

    const id = typeof raw.id === "string" && UUID_RE.test(raw.id) ? raw.id : undefined;

    links.push({
      ...(id ? { id } : {}),
      title,
      url,
      active: raw.active !== false,
      position: links.length,
    });

    if (links.length >= MAX_LINKS_PER_PAGE) break;
  }

  return {
    ok: true,
    value: {
      username: username.value,
      themeId: sanitizeThemeId(draft.themeId),
      displayName: displayName || username.value,
      bio,
      avatarUrl,
      customization: sanitizeCustomization(draft.customization),
      links,
    },
  };
}
