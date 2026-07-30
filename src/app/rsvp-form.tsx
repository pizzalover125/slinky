"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/input";
import { rsvp } from "./actions";

export function RsvpForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [isSubmitting, startSubmit] = useTransition();

  if (done) {
    return (
      <div className="border-[3px] border-ink bg-lime p-6 shadow-brut-lg">
        <p className="font-display text-2xl">You&rsquo;re on the list.</p>
        <p className="mt-2 text-ink/70">
          We&rsquo;ll email you the moment slinky opens up.
        </p>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);
        startSubmit(async () => {
          const result = await rsvp(email);
          if (result.ok) setDone(true);
          else setError(result.error);
        });
      }}
      className="border-[3px] border-ink bg-white p-6 shadow-brut-lg"
    >
      <Label htmlFor="rsvp-email">Get notified at launch</Label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          id="rsvp-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "rsvp-error" : undefined}
          onChange={(event) => setEmail(event.target.value)}
          disabled={isSubmitting}
          className="sm:flex-1"
        />
        <Button type="submit" disabled={isSubmitting || !email.trim()}>
          {isSubmitting ? "Sending…" : "Notify me"}
        </Button>
      </div>
      <div id="rsvp-error">
        <FieldError>{error}</FieldError>
      </div>
    </form>
  );
}
