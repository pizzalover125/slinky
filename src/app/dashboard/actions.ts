"use server";

import { revalidatePath } from "next/cache";
import { sanitizeDraft } from "@/lib/sanitize";
import { createClient, getUser } from "@/lib/supabase/server";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function deletePage(pageId: string): Promise<ActionResult> {
  const user = await getUser();
  if (!user) return { ok: false, error: "Sign in first." };

  const supabase = await createClient();
  // The user_id predicate is belt-and-braces alongside RLS.
  const { error } = await supabase
    .from("pages")
    .delete()
    .eq("id", pageId)
    .eq("user_id", user.id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard");
  return { ok: true };
}

export async function setPublished(
  pageId: string,
  published: boolean,
): Promise<ActionResult> {
  const user = await getUser();
  if (!user) return { ok: false, error: "Sign in first." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("pages")
    .update({ published })
    .eq("id", pageId)
    .eq("user_id", user.id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard");
  return { ok: true };
}

/**
 * Save an edit to an existing page. Links are replaced wholesale rather than
 * diffed — click counts are preserved by matching on the incoming link id,
 * so a reorder or rename doesn't reset a counter.
 */
export async function updatePage(
  pageId: string,
  draft: unknown,
): Promise<ActionResult> {
  const user = await getUser();
  if (!user) return { ok: false, error: "Sign in first." };

  const clean = sanitizeDraft(draft);
  if (!clean.ok) return { ok: false, error: clean.error };
  const page = clean.value;

  const supabase = await createClient();

  const { data: owned } = await supabase
    .from("pages")
    .select("id")
    .eq("id", pageId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!owned) return { ok: false, error: "Page not found." };

  const { error: pageError } = await supabase
    .from("pages")
    .update({
      username: page.username,
      theme_id: page.themeId,
      display_name: page.displayName,
      bio: page.bio,
      avatar_url: page.avatarUrl,
      customization: page.customization,
    })
    .eq("id", pageId)
    .eq("user_id", user.id);

  if (pageError) {
    if (pageError.code === "23505") {
      return { ok: false, error: "That username is taken." };
    }
    return { ok: false, error: pageError.message };
  }

  // Anything in the database that the editor no longer knows about was
  // deleted by the user. Rows the editor still carries keep their id — and
  // therefore their click count.
  const keptIds = new Set(
    page.links.map((l) => l.id).filter((id): id is string => Boolean(id)),
  );

  const { data: existing } = await supabase
    .from("links")
    .select("id")
    .eq("page_id", pageId);

  const stale = (existing ?? []).map((l) => l.id).filter((id) => !keptIds.has(id));

  if (stale.length) {
    const { error: deleteError } = await supabase
      .from("links")
      .delete()
      .in("id", stale);
    if (deleteError) return { ok: false, error: deleteError.message };
  }

  const rows = page.links.map((link, index) => ({
    ...(link.id ? { id: link.id } : {}),
    page_id: pageId,
    title: link.title,
    url: link.url,
    active: link.active,
    position: index,
  }));

  if (rows.length) {
    const { error: linksError } = await supabase
      .from("links")
      .upsert(rows, { onConflict: "id" });
    if (linksError) return { ok: false, error: linksError.message };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/${page.username}`);
  return { ok: true };
}
