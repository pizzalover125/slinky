"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

type Provider = "google";

const PROVIDERS: { id: Provider; label: string; icon: React.ReactNode }[] = [
  {
    id: "google",
    label: "Continue with Google",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          fill="currentColor"
          d="M21.35 11.1h-9.17v2.98h5.27c-.23 1.37-1.6 4.01-5.27 4.01-3.17 0-5.76-2.63-5.76-5.86s2.59-5.86 5.76-5.86c1.81 0 3.02.77 3.71 1.44l2.53-2.44C16.78 3.79 14.66 2.9 12.18 2.9 6.98 2.9 2.77 7.11 2.77 12.3s4.21 9.4 9.41 9.4c5.43 0 9.03-3.82 9.03-9.2 0-.62-.07-1.09-.16-1.4z"
        />
      </svg>
    ),
  },
];

export function OAuthButtons({ next }: { next?: string }) {
  const [pending, setPending] = useState<Provider | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function signIn(provider: Provider) {
    setPending(provider);
    setError(null);
    try {
      const supabase = createClient();
      const callback = new URL("/auth/callback", window.location.origin);
      if (next) callback.searchParams.set("next", next);

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: callback.toString() },
      });
      if (error) throw error;
      // On success the browser is navigating away; leave `pending` set.
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
      setPending(null);
    }
  }

  return (
    <div className="space-y-3">
      {PROVIDERS.map((provider) => (
        <Button
          key={provider.id}
          type="button"
          variant="neutral"
          size="lg"
          className="w-full"
          disabled={pending !== null}
          onClick={() => signIn(provider.id)}
        >
          {provider.icon}
          {pending === provider.id ? "Redirecting…" : provider.label}
        </Button>
      ))}

      {error ? (
        <p className="border-[3px] border-ink bg-hot px-4 py-3 text-sm font-bold text-white" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
