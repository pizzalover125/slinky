"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { useDraft } from "@/components/builder/draft-provider";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { clearDraft } from "@/lib/draft";
import { validateUsername } from "@/lib/validate";
import { checkUsername, publishDraft } from "./actions";
import { cn } from "@/lib/cn";

type Availability =
  | { state: "idle" }
  | { state: "checking" }
  | { state: "available" }
  | { state: "unavailable"; message: string };

/** A settled server verdict, tagged with the username it was asked about. */
type RemoteVerdict = {
  username: string;
  available: boolean;
  error?: string;
};

export function PublishForm({ siteHost }: { siteHost: string }) {
  const { draft, update, reset } = useDraft();
  const router = useRouter();
  const [verdict, setVerdict] = useState<RemoteVerdict | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPublishing, startPublish] = useTransition();

  // Guards against a slow check resolving after a newer one and
  // overwriting it with a stale verdict.
  const requestId = useRef(0);
  const username = draft.username;
  const local = validateUsername(username);

  useEffect(() => {
    if (!local.ok) return;

    const id = ++requestId.current;
    const timer = setTimeout(async () => {
      const result = await checkUsername(local.value);
      if (id !== requestId.current) return;
      setVerdict({
        username: local.value,
        available: result.available,
        error: result.error,
      });
    }, 350);

    return () => clearTimeout(timer);
  }, [local.ok, local.value]);

  // Derived, not stored: local validation is synchronous, and the server
  // verdict only counts while it still matches what's in the box.
  const availability: Availability = !username
    ? { state: "idle" }
    : !local.ok
      ? { state: "unavailable", message: local.error ?? "Invalid." }
      : verdict?.username !== local.value
        ? { state: "checking" }
        : verdict.available
          ? { state: "available" }
          : { state: "unavailable", message: verdict.error ?? "Unavailable." };

  function onPublish() {
    setError(null);
    startPublish(async () => {
      const result = await publishDraft(draft);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      clearDraft();
      reset();
      router.push(`/${result.username}?published=1`);
    });
  }

  const canPublish = availability.state === "available" && !isPublishing;

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="username">Your slinky address</Label>
        <div className="flex items-stretch">
          <span className="flex items-center border-[3px] border-r-0 border-ink bg-ink px-3 text-sm font-bold text-white">
            {siteHost}/
          </span>
          <Input
            id="username"
            value={username}
            onChange={(e) =>
              update({ username: e.target.value.toLowerCase().trim() })
            }
            placeholder="yourname"
            autoComplete="off"
            spellCheck={false}
            maxLength={30}
            aria-invalid={availability.state === "unavailable" || undefined}
            aria-describedby="username-status"
            className="rounded-none"
          />
        </div>

        <p
          id="username-status"
          aria-live="polite"
          className={cn(
            "mt-2 text-sm font-bold",
            availability.state === "available" && "text-blue",
            availability.state === "unavailable" && "text-hot",
            availability.state === "checking" && "text-ink/50",
          )}
        >
          {availability.state === "checking" && "Checking…"}
          {availability.state === "available" && "✓ It's yours."}
          {availability.state === "unavailable" && availability.message}
        </p>
      </div>

      <Button
        type="button"
        size="lg"
        className="w-full"
        disabled={!canPublish}
        onClick={onPublish}
      >
        {isPublishing ? "Publishing…" : "Publish it"}
      </Button>

      {error ? (
        <p
          className="border-[3px] border-ink bg-hot px-4 py-3 text-sm font-bold text-white"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
