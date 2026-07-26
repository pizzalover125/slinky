import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { DraftProvider } from "@/components/builder/draft-provider";
import { Logo } from "@/components/logo";
import { listUserPages } from "@/lib/pages";
import { isSupabaseConfigured, siteUrl } from "@/lib/supabase/env";
import { getUser } from "@/lib/supabase/server";
import type { DraftPage } from "@/lib/types";
import { Editor } from "./editor";

export const metadata = { title: "Edit page" };

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!isSupabaseConfigured) redirect("/login");

  const { id } = await params;
  const user = await getUser();
  if (!user) redirect(`/login?next=/dashboard/${id}`);

  const page = (await listUserPages(user.id)).find((p) => p.id === id);
  if (!page) notFound();

  const initial: DraftPage = {
    username: page.username,
    themeId: page.themeId,
    profile: page.profile,
    customization: page.customization,
    links: page.links,
  };

  const host = new URL(siteUrl()).host;

  return (
    <>
      <header className="border-b-[3px] border-ink">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <Link href="/" aria-label="slinky home">
            <Logo />
          </Link>
          <a
            href={`/${page.username}`}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-bold underline decoration-dotted underline-offset-4 hover:text-hot"
          >
            {host}/{page.username} ↗
          </a>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10">
        <h1 className="mb-8 text-4xl">
          Editing <span className="text-hot">/{page.username}</span>
        </h1>
        {/* persist=false: the database is the source of truth here, and a
            shared localStorage draft would bleed between pages. */}
        <DraftProvider initial={initial} persist={false}>
          <Editor pageId={page.id} />
        </DraftProvider>
      </main>
    </>
  );
}
