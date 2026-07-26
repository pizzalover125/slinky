import type { BackgroundChoice, Customization, PatternId } from "@/lib/types";

/**
 * Themes are pure data. Every theme compiles down to the same set of
 * `--sl-*` custom properties, which `PageRenderer` consumes — so adding
 * the remaining themes post-launch is a data change, not a render change.
 *
 * Deliberately NOT all neobrutalist. Slinky's own app shell has a loud
 * identity; the theme library exists to give users somewhere else to go.
 */

/** Font stacks are wired to next/font variables loaded in the public layout. */
export type FontKey = "archivo" | "grotesk" | "serif" | "mono";

export const FONT_STACKS: Record<FontKey, string> = {
  archivo: "var(--font-archivo-black), system-ui, sans-serif",
  grotesk: "var(--font-space-grotesk), system-ui, sans-serif",
  serif: "var(--font-instrument-serif), Georgia, serif",
  mono: "var(--font-jetbrains-mono), ui-monospace, monospace",
};

export interface Theme {
  id: string;
  name: string;
  blurb: string;
  /** Rough style bucket — used to group the picker once there are 30. */
  family: "brutalist" | "editorial" | "terminal" | "soft" | "retro";
  fontDisplay: FontKey;
  fontBody: FontKey;
  colors: {
    bg: string;
    surface: string;
    surfaceText: string;
    text: string;
    muted: string;
    accent: string;
    border: string;
  };
  shape: {
    radius: string;
    borderWidth: string;
    /** May reference `var(--sl-border)` / `var(--sl-accent)`. */
    shadow: string;
    shadowHover: string;
    linkPadding: string;
    gap: string;
    avatarRadius: string;
    linkTransform: "uppercase" | "none";
    linkWeight: string;
    letterSpacing: string;
  };
  /** Optional decorative layer painted behind content. */
  backdrop?: {
    backgroundImage: string;
    backgroundSize?: string;
  };
}

export const THEMES: Theme[] = [
  {
    id: "concrete",
    name: "Concrete",
    blurb: "Hard shadows, thick rules, zero apology.",
    family: "brutalist",
    fontDisplay: "archivo",
    fontBody: "grotesk",
    colors: {
      bg: "#C6FF3D",
      surface: "#FFFFFF",
      surfaceText: "#000000",
      text: "#000000",
      muted: "#000000",
      accent: "#FF2D6B",
      border: "#000000",
    },
    shape: {
      radius: "0px",
      borderWidth: "3px",
      shadow: "6px 6px 0 0 var(--sl-border)",
      shadowHover: "2px 2px 0 0 var(--sl-border)",
      linkPadding: "1rem 1.25rem",
      gap: "0.875rem",
      avatarRadius: "0px",
      linkTransform: "uppercase",
      linkWeight: "700",
      letterSpacing: "-0.01em",
    },
  },
  {
    id: "paper",
    name: "Paper",
    blurb: "Quiet serif editorial. Hairline rules, lots of air.",
    family: "editorial",
    fontDisplay: "serif",
    fontBody: "grotesk",
    colors: {
      bg: "#F7F4EE",
      surface: "#F7F4EE",
      surfaceText: "#1A1A18",
      text: "#1A1A18",
      muted: "#6B675E",
      accent: "#8B3A2F",
      border: "#CFC8BA",
    },
    shape: {
      radius: "0px",
      borderWidth: "1px",
      shadow: "none",
      shadowHover: "none",
      linkPadding: "1.125rem 0.25rem",
      gap: "0.375rem",
      avatarRadius: "999px",
      linkTransform: "none",
      linkWeight: "500",
      letterSpacing: "0.01em",
    },
  },
  {
    id: "terminal",
    name: "Terminal",
    blurb: "Phosphor green on black. Monospace everything.",
    family: "terminal",
    fontDisplay: "mono",
    fontBody: "mono",
    colors: {
      bg: "#08120C",
      surface: "#0E1F16",
      surfaceText: "#4AF08A",
      text: "#4AF08A",
      muted: "#2C8C56",
      accent: "#4AF08A",
      border: "#1E5C39",
    },
    shape: {
      radius: "2px",
      borderWidth: "1px",
      shadow: "none",
      shadowHover: "0 0 0 1px var(--sl-accent)",
      linkPadding: "0.875rem 1rem",
      gap: "0.5rem",
      avatarRadius: "2px",
      linkTransform: "none",
      linkWeight: "400",
      letterSpacing: "0.02em",
    },
    backdrop: {
      // Faint CRT scanlines.
      backgroundImage:
        "repeating-linear-gradient(180deg, rgba(74,240,138,0.05) 0px, rgba(74,240,138,0.05) 1px, transparent 1px, transparent 3px)",
    },
  },
];

export const DEFAULT_THEME_ID = "concrete";

export function getTheme(id: string): Theme {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}

export function patternCss(
  pattern: PatternId,
  color: string,
): { backgroundImage: string; backgroundSize: string } {
  switch (pattern) {
    case "dots":
      return {
        backgroundImage: `radial-gradient(${color} 2px, transparent 2px)`,
        backgroundSize: "20px 20px",
      };
    case "grid":
      return {
        backgroundImage: `linear-gradient(${color} 2px, transparent 2px), linear-gradient(90deg, ${color} 2px, transparent 2px)`,
        backgroundSize: "32px 32px",
      };
    case "stripes":
      return {
        backgroundImage: `repeating-linear-gradient(45deg, ${color} 0 8px, transparent 8px 24px)`,
        backgroundSize: "auto",
      };
    case "checks":
      return {
        backgroundImage: `conic-gradient(${color} 0 25%, transparent 0 50%, ${color} 0 75%, transparent 0)`,
        backgroundSize: "32px 32px",
      };
    case "zigzag":
      return {
        backgroundImage: [
          `linear-gradient(135deg, ${color} 25%, transparent 25%)`,
          `linear-gradient(225deg, ${color} 25%, transparent 25%)`,
          `linear-gradient(315deg, ${color} 25%, transparent 25%)`,
          `linear-gradient(45deg, ${color} 25%, transparent 25%)`,
        ].join(", "),
        backgroundSize: "32px 32px",
      };
  }
}

function resolveBackground(theme: Theme, bg: BackgroundChoice) {
  if (bg.type === "solid") {
    return { color: bg.color, image: "none", size: "auto" };
  }
  if (bg.type === "pattern") {
    const { backgroundImage, backgroundSize } = patternCss(
      bg.pattern,
      bg.color,
    );
    return { color: bg.on, image: backgroundImage, size: backgroundSize };
  }
  return {
    color: theme.colors.bg,
    image: theme.backdrop?.backgroundImage ?? "none",
    size: theme.backdrop?.backgroundSize ?? "auto",
  };
}

/**
 * Compile a theme + user overrides into inline CSS custom properties.
 * Returned object is spread onto the renderer's root element.
 */
export function themeToStyle(
  theme: Theme,
  customization: Customization,
): React.CSSProperties {
  const accent = customization.accent ?? theme.colors.accent;
  const border = customization.border ?? theme.colors.border;
  const bg = resolveBackground(theme, customization.background);

  return {
    "--sl-bg": bg.color,
    "--sl-bg-image": bg.image,
    "--sl-bg-size": bg.size,
    "--sl-surface": theme.colors.surface,
    "--sl-surface-text": theme.colors.surfaceText,
    "--sl-text": theme.colors.text,
    "--sl-muted": theme.colors.muted,
    "--sl-accent": accent,
    "--sl-border": border,
    "--sl-font-display": FONT_STACKS[theme.fontDisplay],
    "--sl-font-body": FONT_STACKS[theme.fontBody],
    "--sl-radius": theme.shape.radius,
    "--sl-border-width": theme.shape.borderWidth,
    "--sl-shadow": theme.shape.shadow,
    "--sl-shadow-hover": theme.shape.shadowHover,
    "--sl-link-padding": theme.shape.linkPadding,
    "--sl-gap": theme.shape.gap,
    "--sl-avatar-radius": theme.shape.avatarRadius,
    "--sl-link-transform": theme.shape.linkTransform,
    "--sl-link-weight": theme.shape.linkWeight,
    "--sl-tracking": theme.shape.letterSpacing,
  } as React.CSSProperties;
}
