import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageRenderer } from "@/components/page-renderer";
import { themeFontVars } from "@/lib/fonts";
import { getPublicPage } from "@/lib/pages";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { validateUsername } from "@/lib/validate";

/** Published pages change rarely; revalidate rather than render per request. */
export const revalidate = 60;

async function load(usernameRaw: string) {
  if (!isSupabaseConfigured) return null;
  const { ok, value } = validateUsername(usernameRaw);
  if (!ok) return null;
  return getPublicPage(value);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const page = await load(username);
  if (!page) return { title: "Not found" };

  const name = page.profile.displayName || page.username;
  return {
    title: name,
    description: page.profile.bio || `${name} on slinky`,
    openGraph: {
      title: name,
      description: page.profile.bio || `${name} on slinky`,
      type: "profile",
    },
  };
}

export default async function PublicPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const page = await load(username);
  if (!page) notFound();

  return (
    <div className={`${themeFontVars} flex min-h-dvh flex-col`}>
      <PageRenderer
        themeId={page.themeId}
        profile={page.profile}
        customization={page.customization}
        links={page.links}
        hrefFor={(link) => `/go/${link.id}`}
        className="flex-1"
      />
    </div>
  );
}
