"use client";

import { useDraft } from "@/components/builder/draft-provider";
import { LinkEditor } from "@/components/builder/link-editor";
import { StepFooter } from "@/components/builder/step-nav";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/input";
import { MAX_LINKS_PER_PAGE } from "@/lib/types";

export default function LinksStep() {
  const { draft, update, addLink } = useDraft();
  const atLimit = draft.links.length >= MAX_LINKS_PER_PAGE;

  return (
    <section>
      <Chip tone="mint">Step 2</Chip>
      <h1 className="mt-4 text-5xl">Add your stuff.</h1>

      <div className="mt-8 border-[3px] border-ink bg-white p-5 shadow-brut">
        <h2 className="mb-4 text-xl">Profile</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="displayName">Display name</Label>
            <Input
              id="displayName"
              value={draft.profile.displayName}
              onChange={(e) =>
                update({
                  profile: { ...draft.profile, displayName: e.target.value },
                })
              }
              placeholder="Your name or handle"
              maxLength={50}
            />
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              rows={2}
              value={draft.profile.bio}
              onChange={(e) =>
                update({ profile: { ...draft.profile, bio: e.target.value } })
              }
              placeholder="One line about you."
              maxLength={160}
            />
            <p className="mt-1 text-right text-xs tabular-nums text-ink/50">
              {draft.profile.bio.length}/160
            </p>
          </div>
          <div>
            <Label htmlFor="avatarUrl">Avatar URL (optional)</Label>
            <Input
              id="avatarUrl"
              value={draft.profile.avatarUrl ?? ""}
              onChange={(e) =>
                update({
                  profile: {
                    ...draft.profile,
                    avatarUrl: e.target.value || null,
                  },
                })
              }
              placeholder="https://…"
              inputMode="url"
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-baseline justify-between gap-3">
          <h2 className="text-xl">Links</h2>
          <span className="text-xs font-bold uppercase tracking-widest tabular-nums text-ink/50">
            {draft.links.length}/{MAX_LINKS_PER_PAGE}
          </span>
        </div>

        <LinkEditor />

        <Button
          type="button"
          onClick={addLink}
          disabled={atLimit}
          variant="secondary"
          className="mt-4 w-full"
        >
          + Add link
        </Button>
        {atLimit ? (
          <p className="mt-2 text-sm font-bold text-hot">
            That&apos;s the max for one page.
          </p>
        ) : null}
      </div>

      <StepFooter
        back="/create"
        next="/create/customize"
        nextLabel="Customize"
      />
    </section>
  );
}
