import { themeToStyle, THEMES } from "@/lib/themes";
import { themeFontVars } from "@/lib/fonts";
import { DEFAULT_CUSTOMIZATION } from "@/lib/types";

/**
 * Miniature, non-interactive renderings of each built-in theme. Shared by the
 * landing page and the demo page so both show the same thing.
 */
export function ThemeStrip() {
  return (
    <div className={`${themeFontVars} grid gap-6 sm:grid-cols-3`}>
      {THEMES.map((theme, i) => (
        <div
          key={theme.id}
          className="border-[3px] border-ink shadow-brut-lg"
          style={{ rotate: `${(i - 1) * 1.5}deg` }}
        >
          <div
            style={themeToStyle(theme, DEFAULT_CUSTOMIZATION)}
            className="flex h-64 flex-col items-center gap-2.5 overflow-hidden bg-[var(--sl-bg)] bg-[image:var(--sl-bg-image)] bg-[length:var(--sl-bg-size)] px-7 pt-8"
          >
            <div
              className="h-10 w-10 border-[length:var(--sl-border-width)] border-[var(--sl-border)] bg-[var(--sl-surface)]"
              style={{ borderRadius: "var(--sl-avatar-radius)" }}
            />
            <div
              className="font-[family-name:var(--sl-font-display)] text-base text-[var(--sl-text)]"
              style={{ letterSpacing: "var(--sl-tracking)" }}
            >
              {theme.name}
            </div>
            <div
              className="flex w-full flex-col"
              style={{ gap: "var(--sl-gap)" }}
            >
              {[0, 1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="border-[length:var(--sl-border-width)] border-[var(--sl-border)] bg-[var(--sl-surface)] px-3 py-2.5"
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
          <p className="border-t-[3px] border-ink bg-white px-4 py-3 text-sm">
            <span className="font-bold">{theme.name}</span>
            <span className="text-ink/60">: {theme.blurb}</span>
          </p>
        </div>
      ))}
    </div>
  );
}
