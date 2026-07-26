"use client";

import { PageRenderer } from "@/components/page-renderer";
import { useDraft } from "@/components/builder/draft-provider";
import { themeFontVars } from "@/lib/fonts";
import { cn } from "@/lib/cn";

export function Preview({ className }: { className?: string }) {
  const { draft, hydrated } = useDraft();

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div
        className={cn(
          themeFontVars,
          "h-[620px] w-[320px] shrink-0 overflow-y-auto overscroll-contain border-[3px] border-ink bg-white shadow-brut-xl",
        )}
      >
        {hydrated ? (
          <PageRenderer
            preview
            themeId={draft.themeId}
            profile={draft.profile}
            customization={draft.customization}
            links={draft.links}
          />
        ) : (
          <div className="h-full w-full animate-pulse bg-ink/5" />
        )}
      </div>
      <p className="text-xs font-bold uppercase tracking-widest text-ink/50">
        Live preview
      </p>
    </div>
  );
}
