"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useDraft } from "@/components/builder/draft-provider";
import { ColorField } from "@/components/builder/color-field";
import { LinkEditor } from "@/components/builder/link-editor";
import { Preview } from "@/components/builder/preview";
import { ThemeCard } from "@/components/builder/theme-card";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { getTheme, THEMES } from "@/lib/themes";
import { MAX_LINKS_PER_PAGE } from "@/lib/types";
import { updatePage } from "../actions";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-[3px] border-ink bg-white p-5 shadow-brut">
      <h2 className="mb-4 text-xl">{title}</h2>
      {children}
    </section>
  );
}

export function Editor({ pageId }: { pageId: string }) {
  const { draft, update, addLink } = useDraft();
  const router = useRouter();
  const [saving, startSaving] = useTransition();
  const [status, setStatus] = useState<
    { kind: "error"; message: string } | { kind: "saved" } | null
  >(null);

  const theme = getTheme(draft.themeId);
  const { customization } = draft;

  function onSave() {
    setStatus(null);
    startSaving(async () => {
      const result = await updatePage(pageId, draft);
      if (!result.ok) {
        setStatus({ kind: "error", message: result.error });
        return;
      }
      setStatus({ kind: "saved" });
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
      <div className="min-w-0 flex-1 space-y-8">
        <Section title="Profile">
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
                maxLength={160}
              />
            </div>
            <div>
              <Label htmlFor="avatarUrl">Avatar URL</Label>
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
        </Section>

        <Section title="Links">
          <LinkEditor />
          <Button
            type="button"
            onClick={addLink}
            disabled={draft.links.length >= MAX_LINKS_PER_PAGE}
            variant="secondary"
            className="mt-4 w-full"
          >
            + Add link
          </Button>
        </Section>

        <Section title="Theme">
          <div className="grid gap-5 sm:grid-cols-2">
            {THEMES.map((t) => (
              <ThemeCard
                key={t.id}
                theme={t}
                selected={draft.themeId === t.id}
                onSelect={() => update({ themeId: t.id })}
              />
            ))}
          </div>
        </Section>

        <Section title="Colours">
          <div className="space-y-6">
            <ColorField
              label="Accent"
              value={customization.accent}
              themeDefault={theme.colors.accent}
              onChange={(accent) =>
                update({ customization: { ...customization, accent } })
              }
            />
            <ColorField
              label="Border"
              value={customization.border}
              themeDefault={theme.colors.border}
              onChange={(border) =>
                update({ customization: { ...customization, border } })
              }
            />
          </div>
        </Section>

        <div className="sticky bottom-0 flex flex-wrap items-center gap-4 border-t-[3px] border-ink bg-cream py-4">
          <Button type="button" size="lg" onClick={onSave} disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
          <Link
            href="/dashboard"
            className="text-sm font-bold uppercase tracking-widest underline underline-offset-4"
          >
            Back to dashboard
          </Link>

          {status?.kind === "saved" ? (
            <span className="text-sm font-bold text-blue" role="status">
              ✓ Saved
            </span>
          ) : null}
          {status?.kind === "error" ? (
            <span className="text-sm font-bold text-hot" role="alert">
              {status.message}
            </span>
          ) : null}
        </div>
      </div>

      <div className="lg:sticky lg:top-10">
        <Preview />
      </div>
    </div>
  );
}
