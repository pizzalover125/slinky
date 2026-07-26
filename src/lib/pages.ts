import "server-only";

import { createClient } from "@/lib/supabase/server";
import { sanitizeCustomization, sanitizeThemeId } from "@/lib/sanitize";
import type { SlinkyLink, SlinkyPage } from "@/lib/types";
import type { LinkRow, PageRow } from "@/lib/supabase/types";

function toSlinkyPage(page: PageRow, links: LinkRow[]): SlinkyPage {
  return {
    id: page.id,
    username: page.username,
    themeId: sanitizeThemeId(page.theme_id),
    profile: {
      displayName: page.display_name,
      bio: page.bio,
      avatarUrl: page.avatar_url,
    },
    customization: sanitizeCustomization(page.customization),
    published: page.published,
    links: links
      .map(
        (l): SlinkyLink => ({
          id: l.id,
          title: l.title,
          url: l.url,
          active: l.active,
          position: l.position,
          clickCount: l.click_count,
        }),
      )
      .sort((a, b) => a.position - b.position),
  };
}

/** Public read for `/[username]`. Returns null for unknown or unpublished pages. */
export async function getPublicPage(
  username: string,
): Promise<SlinkyPage | null> {
  const supabase = await createClient();

  const { data: page } = await supabase
    .from("pages")
    .select("*")
    .eq("username", username.toLowerCase())
    .eq("published", true)
    .maybeSingle();

  if (!page) return null;

  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("page_id", page.id)
    .order("position", { ascending: true });

  return toSlinkyPage(page, links ?? []);
}

export async function listUserPages(userId: string): Promise<SlinkyPage[]> {
  const supabase = await createClient();

  const { data: pages } = await supabase
    .from("pages")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (!pages?.length) return [];

  const { data: links } = await supabase
    .from("links")
    .select("*")
    .in(
      "page_id",
      pages.map((p) => p.id),
    );

  return pages.map((page) =>
    toSlinkyPage(
      page,
      (links ?? []).filter((l) => l.page_id === page.id),
    ),
  );
}

export async function isUsernameTaken(username: string): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("pages")
    .select("id")
    .eq("username", username.toLowerCase())
    .maybeSingle();
  return Boolean(data);
}
