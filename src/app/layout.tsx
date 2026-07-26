import type { Metadata, Viewport } from "next";
import { Archivo_Black, Space_Grotesk } from "next/font/google";
import "./globals.css";

const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://yourslinky.co",
  ),
  title: {
    default: "slinky",
    template: "%s — slinky",
  },
  description:
    "A free, open-source, ultra-customizable link-in-bio tool for small creators. Pick from a wildly diverse theme library. No lock-in, no paywalled customization.",
  openGraph: {
    title: "slinky",
    description:
      "A free, open-source link-in-bio tool for small creators. MIT licensed.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFF9E6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivoBlack.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
