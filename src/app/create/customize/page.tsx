"use client";

import { useDraft } from "@/components/builder/draft-provider";
import { ColorField } from "@/components/builder/color-field";
import { StepFooter } from "@/components/builder/step-nav";
import { Chip } from "@/components/ui/card";
import { Label } from "@/components/ui/input";
import { getTheme, patternCss } from "@/lib/themes";
import type { BackgroundChoice, PatternId } from "@/lib/types";
import { cn } from "@/lib/cn";

const PATTERNS: PatternId[] = ["dots", "grid", "stripes", "checks", "zigzag"];

export default function CustomizeStep() {
  const { draft, update } = useDraft();
  const theme = getTheme(draft.themeId);
  const { customization } = draft;
  const bg = customization.background;

  function setBackground(next: BackgroundChoice) {
    update({ customization: { ...customization, background: next } });
  }

  return (
    <section>
      <Chip tone="blue">Step 3</Chip>
      <h1 className="mt-4 text-5xl">Make it yours.</h1>
      <p className="mt-4 max-w-lg text-lg text-ink/70">
        Every one of these is free, forever. That&apos;s rather the point.
      </p>

      <div className="mt-8 space-y-6 border-[3px] border-ink bg-white p-5 shadow-brut">
        <h2 className="text-xl">Colours</h2>
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

      <div className="mt-8 space-y-5 border-[3px] border-ink bg-white p-5 shadow-brut">
        <h2 className="text-xl">Background</h2>

        <div>
          <Label>Style</Label>
          <div className="flex flex-wrap gap-2">
            {(
              [
                { key: "theme", label: "Theme default" },
                { key: "solid", label: "Solid colour" },
                { key: "pattern", label: "Pattern" },
              ] as const
            ).map((option) => (
              <button
                key={option.key}
                type="button"
                aria-pressed={bg.type === option.key}
                onClick={() => {
                  if (option.key === "theme") setBackground({ type: "theme" });
                  else if (option.key === "solid")
                    setBackground({ type: "solid", color: theme.colors.bg });
                  else
                    setBackground({
                      type: "pattern",
                      pattern: "dots",
                      color: theme.colors.border,
                      on: theme.colors.bg,
                    });
                }}
                className={cn(
                  "border-[3px] border-ink px-4 py-2 text-sm font-bold uppercase tracking-widest shadow-brut-sm brut-press",
                  bg.type === option.key ? "bg-hot text-white" : "bg-white",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {bg.type === "solid" ? (
          <ColorField
            label="Background colour"
            value={bg.color}
            themeDefault={theme.colors.bg}
            allowReset={false}
            onChange={(color) =>
              color && setBackground({ type: "solid", color })
            }
          />
        ) : null}

        {bg.type === "pattern" ? (
          <div className="space-y-5">
            <div>
              <Label>Pattern</Label>
              <div className="flex flex-wrap gap-2">
                {PATTERNS.map((pattern) => {
                  const css = patternCss(pattern, bg.color);
                  return (
                    <button
                      key={pattern}
                      type="button"
                      aria-pressed={bg.pattern === pattern}
                      aria-label={pattern}
                      onClick={() => setBackground({ ...bg, pattern })}
                      className={cn(
                        "h-14 w-14 border-[3px] border-ink shadow-brut-sm brut-press",
                        bg.pattern === pattern && "ring-2 ring-blue ring-offset-2",
                      )}
                      style={{
                        backgroundColor: bg.on,
                        backgroundImage: css.backgroundImage,
                        backgroundSize: css.backgroundSize,
                      }}
                    />
                  );
                })}
              </div>
            </div>

            <ColorField
              label="Pattern colour"
              value={bg.color}
              themeDefault={theme.colors.border}
              allowReset={false}
              onChange={(color) => color && setBackground({ ...bg, color })}
            />
            <ColorField
              label="Behind the pattern"
              value={bg.on}
              themeDefault={theme.colors.bg}
              allowReset={false}
              onChange={(on) => on && setBackground({ ...bg, on })}
            />
          </div>
        ) : null}
      </div>

      <StepFooter
        back="/create/links"
        next="/create/publish"
        nextLabel="Publish"
      />
    </section>
  );
}
