/** Core domain types shared by the builder, the database layer, and the renderer. */

export interface SlinkyLink {
  id: string;
  title: string;
  url: string;
  /** Inactive links stay in the editor but are hidden on the public page. */
  active: boolean;
  position: number;
  clickCount?: number;
}

export interface PageProfile {
  displayName: string;
  bio: string;
  avatarUrl?: string | null;
}

export type PatternId = "dots" | "grid" | "stripes" | "checks" | "zigzag";

export type BackgroundChoice =
  | { type: "theme" }
  | { type: "solid"; color: string }
  | { type: "pattern"; pattern: PatternId; color: string; on: string };

/**
 * User overrides layered on top of the chosen theme. `null` means
 * "inherit from the theme" — we never bake theme defaults into the
 * customization record, so a theme swap keeps un-customized fields fresh.
 */
export interface Customization {
  accent: string | null;
  border: string | null;
  background: BackgroundChoice;
}

export const DEFAULT_CUSTOMIZATION: Customization = {
  accent: null,
  border: null,
  background: { type: "theme" },
};

export interface SlinkyPage {
  id: string;
  username: string;
  themeId: string;
  profile: PageProfile;
  customization: Customization;
  links: SlinkyLink[];
  published?: boolean;
}

/** The unsaved page a signed-out visitor builds in localStorage. */
export type DraftPage = Omit<SlinkyPage, "id" | "username" | "published"> & {
  username: string;
};

export const MAX_PAGES_PER_USER = 3;
export const MAX_LINKS_PER_PAGE = 50;
