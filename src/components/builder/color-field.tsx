"use client";

import { useState } from "react";
import { Label } from "@/components/ui/input";
import { isHexColor } from "@/lib/validate";
import { cn } from "@/lib/cn";

const PRESETS = [
  "#FF2D6B",
  "#FFD400",
  "#3D5AFE",
  "#6FFFE0",
  "#C6FF3D",
  "#000000",
  "#FFFFFF",
  "#8B3A2F",
];

/**
 * Colour input with three ways in: swatches, the OS picker, or a typed hex.
 * `value === null` means "inherit from the theme"; `themeDefault` is what
 * that currently resolves to, so the control still shows the real colour.
 */
export function ColorField({
  label,
  value,
  themeDefault,
  onChange,
  allowReset = true,
}: {
  label: string;
  value: string | null;
  themeDefault: string;
  onChange: (next: string | null) => void;
  allowReset?: boolean;
}) {
  const resolved = value ?? themeDefault;
  const [text, setText] = useState(resolved);
  const [lastResolved, setLastResolved] = useState(resolved);

  // Keep the text box in step when the value changes from elsewhere (a swatch
  // click, a reset, or a theme swap changing the default). Adjusting during
  // render rather than in an effect avoids a second render pass showing stale
  // text — see https://react.dev/reference/react/useState#storing-information-from-previous-renders
  if (resolved !== lastResolved) {
    setLastResolved(resolved);
    setText(resolved);
  }

  function commitText(next: string) {
    setText(next);
    const withHash = next.startsWith("#") ? next : `#${next}`;
    if (isHexColor(withHash)) onChange(withHash.toUpperCase());
  }

  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <Label>{label}</Label>
        {allowReset && value !== null ? (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="mb-1.5 text-xs font-bold uppercase tracking-widest text-ink/50 underline underline-offset-2 hover:text-hot"
          >
            Reset
          </button>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        <label
          className="relative h-11 w-11 shrink-0 cursor-pointer border-[3px] border-ink shadow-brut-sm"
          style={{ backgroundColor: resolved }}
        >
          <span className="sr-only">{label} colour picker</span>
          <input
            type="color"
            value={resolved}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </label>

        <input
          value={text}
          onChange={(e) => commitText(e.target.value)}
          onBlur={() => setText(resolved)}
          aria-label={`${label} hex value`}
          spellCheck={false}
          className="w-32 border-[3px] border-ink bg-white px-3 py-2.5 font-mono text-sm uppercase shadow-brut-sm focus:outline-none"
        />

        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onChange(preset)}
              aria-label={`Use ${preset}`}
              className={cn(
                "h-7 w-7 border-[3px] border-ink",
                resolved.toUpperCase() === preset && "ring-2 ring-blue ring-offset-2",
              )}
              style={{ backgroundColor: preset }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
