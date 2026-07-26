"use client";

import { themeToStyle, type Theme } from "@/lib/themes";
import { DEFAULT_CUSTOMIZATION } from "@/lib/types";
import { themeFontVars } from "@/lib/fonts";
import { cn } from "@/lib/cn";

/**
 * A miniature of the real thing — same custom properties the renderer uses,
 * so the swatch can't drift from what the theme actually looks like.
 */
export function ThemeCard({
  theme,
  selected,
  onSelect,
}: {
  theme: Theme;
  selected: boolean;
  onSelect: () => void;
}) {
  const style = themeToStyle(theme, DEFAULT_CUSTOMIZATION);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "group flex cursor-pointer flex-col overflow-hidden border-[3px] border-ink text-left shadow-brut brut-press",
        selected ? "bg-hot" : "bg-white",
      )}
    >
      <div
        style={style}
        className={cn(
          themeFontVars,
          "flex h-44 flex-col items-center gap-2 overflow-hidden px-6 pt-6",
          "bg-[var(--sl-bg)] bg-[image:var(--sl-bg-image)] bg-[length:var(--sl-bg-size)]",
        )}
      >
        <div
          className="h-8 w-8 border-[length:var(--sl-border-width)] border-[var(--sl-border)] bg-[var(--sl-surface)]"
          style={{ borderRadius: "var(--sl-avatar-radius)" }}
        />
        <div
          className="font-[family-name:var(--sl-font-display)] text-sm text-[var(--sl-text)]"
          style={{ letterSpacing: "var(--sl-tracking)" }}
        >
          {theme.name}
        </div>
        <div
          className="flex w-full flex-col"
          style={{ gap: "var(--sl-gap)" }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="border-[length:var(--sl-border-width)] border-[var(--sl-border)] bg-[var(--sl-surface)] px-2 py-2"
              style={{
                borderRadius: "var(--sl-radius)",
                boxShadow: "var(--sl-shadow)",
              }}
            >
              <div
                className="h-1.5 w-2/3 opacity-70"
                style={{ background: "var(--sl-surface-text)" }}
              />
            </div>
          ))}
        </div>
      </div>

      <div
        className={cn(
          "flex items-baseline justify-between gap-2 border-t-[3px] border-ink px-4 py-3",
          selected ? "text-white" : "text-ink",
        )}
      >
        <div className="min-w-0">
          <div className="font-display text-lg leading-none">{theme.name}</div>
          <p
            className={cn(
              "mt-1.5 text-xs leading-snug",
              selected ? "text-white/80" : "text-ink/60",
            )}
          >
            {theme.blurb}
          </p>
        </div>
        {selected ? (
          <span className="shrink-0 text-xs font-bold uppercase tracking-widest">
            ✓ Picked
          </span>
        ) : null}
      </div>
    </button>
  );
}
