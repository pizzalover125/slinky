"use client";

import { useDraft } from "@/components/builder/draft-provider";
import { StepFooter } from "@/components/builder/step-nav";
import { ThemeCard } from "@/components/builder/theme-card";
import { Chip } from "@/components/ui/card";
import { THEMES } from "@/lib/themes";

export default function ThemeStep() {
  const { draft, update } = useDraft();

  return (
    <section>
      <Chip tone="lime">Step 1</Chip>
      <h1 className="mt-4 text-5xl">Pick a look.</h1>
      <p className="mt-4 max-w-lg text-lg text-ink/70">
        Three to start, thirty coming. They are not variations on one
        aesthetic — pick something that actually looks like you, not like us.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {THEMES.map((theme) => (
          <ThemeCard
            key={theme.id}
            theme={theme}
            selected={draft.themeId === theme.id}
            onSelect={() => update({ themeId: theme.id })}
          />
        ))}

        <div className="flex flex-col items-start justify-center gap-3 border-[3px] border-dashed border-ink/40 bg-white/50 p-6">
          <Chip tone="yellow">Soon</Chip>
          <p className="text-sm text-ink/60">
            27 more themes land shortly after launch — softer ones, louder
            ones, and a few genuinely ugly ones on purpose.
          </p>
        </div>
      </div>

      <StepFooter next="/create/links" nextLabel="Add links" />
    </section>
  );
}
