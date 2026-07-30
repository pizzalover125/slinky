"use server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { validateEmail } from "@/lib/validate";

export type RsvpResult = { ok: true } | { ok: false; error: string };

export async function rsvp(email: unknown): Promise<RsvpResult> {
  const result = validateEmail(typeof email === "string" ? email : "");
  if (!result.ok) {
    return { ok: false, error: result.error ?? "Enter your email." };
  }

  if (!isSupabaseConfigured) {
    return { ok: false, error: "Sign-ups aren't set up yet. Try again later." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("rsvps").insert({ email: result.value });

  if (error) {
    // 23505 is unique_violation — they're already signed up, which is not a
    // failure from the visitor's point of view.
    if (error.code === "23505") return { ok: true };

    console.error("rsvp insert failed", error);
    return { ok: false, error: "Something broke. Try again." };
  }

  return { ok: true };
}
