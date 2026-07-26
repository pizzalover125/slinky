"use server";

import { revalidatePath } from "next/cache";
import { sanitizeDraft } from "@/lib/sanitize";
import { createClient, getUser } from "@/lib/supabase/server";
import { isUsernameTaken } from "@/lib/pages";
import { validateUsername } from "@/lib/validate";
import { MAX_PAGES_PER_USER } from "@/lib/types";

export type PublishResult =
  | { ok: true; username: string }
  | { ok: false; error: string; field?: "username" };

export async function checkUsername(
  raw: string,
): Promise<{ available: boolean; error?: string }> {
  const result = validateUsername(raw);
  if (!result.ok) return { available: false, error: result.error };

  const taken = await isUsernameTaken(result.value);
  return taken
    ? { available: false, error: "Taken. Try another." }
    : { available: true };
}

export async function publishDraft(draft: unknown): Promise<PublishResult> {
  const user = await getUser();
  if (!user) {
    return { ok: false, error: "Sign in to publish." };
  }

  const clean = sanitizeDraft(draft);
  if (!clean.ok) {
    return { ok: false, error: clean.error, field: "username" };
  }
  const page = clean.value;

  const supabase = await createClient();

  const { count } = await supabase
    .from("pages")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if ((count ?? 0) >= MAX_PAGES_PER_USER) {
    return {
      ok: false,
      error: `You've used all ${MAX_PAGES_PER_USER} pages on this account.`,
    };
  }

  const { data: inserted, error: insertError } = await supabase
    .from("pages")
    .insert({
      user_id: user.id,
      username: page.username,
      theme_id: page.themeId,
      display_name: page.displayName,
      bio: page.bio,
      avatar_url: page.avatarUrl,
      customization: page.customization,
      published: true,
    })
    .select("id")
    .single();

  if (insertError || !inserted) {
    // 23505 is unique_violation — the only user-actionable failure here.
    if (insertError?.code === "23505") {
      return { ok: false, error: "Taken. Try another.", field: "username" };
    }
    return {
      ok: false,
      error: insertError?.message ?? "Could not publish. Try again.",
    };
  }

  if (page.links.length > 0) {
    const { error: linksError } = await supabase.from("links").insert(
      page.links.map((link) => ({
        page_id: inserted.id,
        title: link.title,
        url: link.url,
        active: link.active,
        position: link.position,
      })),
    );

    if (linksError) {
      // Don't strand a page with no links — roll the whole publish back.
      await supabase.from("pages").delete().eq("id", inserted.id);
      return { ok: false, error: "Could not save your links. Try again." };
    }
  }

  revalidatePath("/dashboard");
  revalidatePath(`/${page.username}`);

  return { ok: true, username: page.username };
}
