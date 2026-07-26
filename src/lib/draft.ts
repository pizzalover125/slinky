import { DEFAULT_THEME_ID } from "@/lib/themes";
import {
  DEFAULT_CUSTOMIZATION,
  type DraftPage,
  type SlinkyLink,
} from "@/lib/types";

export const DRAFT_STORAGE_KEY = "slinky:draft:v1";

export function emptyDraft(): DraftPage {
  return {
    username: "",
    themeId: DEFAULT_THEME_ID,
    profile: { displayName: "", bio: "", avatarUrl: null },
    customization: { ...DEFAULT_CUSTOMIZATION },
    links: [],
  };
}

export function newLink(partial: Partial<SlinkyLink> = {}): SlinkyLink {
  return {
    id: crypto.randomUUID(),
    title: "",
    url: "",
    active: true,
    position: 0,
    ...partial,
  };
}

/**
 * Parse whatever is in localStorage back into a draft, tolerating older or
 * hand-mangled payloads — a corrupt draft should cost the user their draft,
 * never a white screen.
 */
export function parseDraft(raw: string | null): DraftPage | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<DraftPage>;
    if (!parsed || typeof parsed !== "object") return null;

    const base = emptyDraft();
    return {
      username:
        typeof parsed.username === "string" ? parsed.username : base.username,
      themeId:
        typeof parsed.themeId === "string" ? parsed.themeId : base.themeId,
      profile: { ...base.profile, ...(parsed.profile ?? {}) },
      customization: { ...base.customization, ...(parsed.customization ?? {}) },
      links: Array.isArray(parsed.links)
        ? parsed.links
            .filter(
              (l): l is SlinkyLink =>
                !!l && typeof l === "object" && typeof l.id === "string",
            )
            .map((l, i) => ({ ...newLink(), ...l, position: i }))
        : [],
    };
  } catch {
    return null;
  }
}

export function loadDraft(): DraftPage | null {
  if (typeof window === "undefined") return null;
  return parseDraft(window.localStorage.getItem(DRAFT_STORAGE_KEY));
}

export function saveDraft(draft: DraftPage) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // Private-browsing quota errors shouldn't break the editor.
  }
}

export function clearDraft() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch {
    // ignore
  }
}

/** Renumber positions to match array order after a reorder or delete. */
export function reindex(links: SlinkyLink[]): SlinkyLink[] {
  return links.map((link, i) => ({ ...link, position: i }));
}
