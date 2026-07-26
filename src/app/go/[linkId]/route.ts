import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { normalizeUrl } from "@/lib/validate";

/** Counting a click is a per-request side effect; never serve this from cache. */
export const dynamic = "force-dynamic";

/**
 * Outbound click tracker. Bumps the link's counter, then forwards to the
 * destination.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ linkId: string }> },
) {
  const home = new URL("/", request.url);
  if (!isSupabaseConfigured) return NextResponse.redirect(home);

  const { linkId } = await params;
  const supabase = await createClient();

  // RLS limits this select to links on published pages.
  const { data: link } = await supabase
    .from("links")
    .select("url, active")
    .eq("id", linkId)
    .maybeSingle();

  if (!link || !link.active) return NextResponse.redirect(home);

  // Re-validate on the way out. The stored value was sanitized on write, but
  // this is the one place we hand a user-supplied string to a browser as a
  // navigation target — an unchecked `javascript:` here would be an XSS.
  const destination = normalizeUrl(link.url);
  if (!destination) return NextResponse.redirect(home);

  // Fire-and-forget would be faster, but the serverless function can be
  // frozen the moment we respond, which drops the write.
  await supabase.rpc("increment_link_click", { link_id: linkId });

  return NextResponse.redirect(destination, {
    status: 302,
    headers: { "Referrer-Policy": "no-referrer" },
  });
}
