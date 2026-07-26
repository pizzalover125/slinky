import { Instrument_Serif, JetBrains_Mono } from "next/font/google";

/**
 * Fonts used by the *theme library* (not the app shell — those live in
 * app/layout.tsx). Applied as a wrapper className only on routes that
 * actually render a user page, so the landing page stays light.
 */

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const themeFontVars = `${instrumentSerif.variable} ${jetbrainsMono.variable}`;
