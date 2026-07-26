import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/card";
import { listUserPages } from "@/lib/pages";
import { isSupabaseConfigured, siteUrl } from "@/lib/supabase/env";
import { getUser } from "@/lib/supabase/server";
import { MAX_PAGES_PER_USER } from "@/lib/types";
import { PageCard } from "./page-card";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  if (!isSupabaseConfigured) redirect("/login");

  const user = await getUser();
  if (!user) redirect("/login?next=/dashboard");

  const pages = await listUserPages(user.id);
  const host = new URL(siteUrl()).host;
  const atLimit = pages.length >= MAX_PAGES_PER_USER;

  return (
    <>
      <header className="border-b-[3px] border-ink">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <Link href="/" aria-label="slinky home">
            <Logo />
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-ink/60 sm:inline">
              {user.email}
            </span>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="border-[3px] border-ink bg-white px-4 py-2 text-sm font-bold uppercase tracking-widest shadow-brut-sm brut-press"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Chip tone="lime">
              {pages.length}/{MAX_PAGES_PER_USER} pages
            </Chip>
            <h1 className="mt-4 text-5xl">Your pages.</h1>
          </div>
          {!atLimit ? (
            <Button asChild size="lg">
              <Link href="/create">+ New page</Link>
            </Button>
          ) : null}
        </div>

        {pages.length === 0 ? (
          <div className="mt-10 border-[3px] border-dashed border-ink/40 bg-white/50 p-12 text-center">
            <h2 className="text-3xl">Nothing here yet.</h2>
            <p className="mx-auto mt-3 max-w-sm text-ink/70">
              Build your first page — pick a theme, drop in your links, publish.
              Takes about two minutes.
            </p>
            <Button asChild size="lg" className="mt-6">
              <Link href="/create">Start building</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {pages.map((page) => (
              <PageCard key={page.id} page={page} siteHost={host} />
            ))}
          </div>
        )}

        {atLimit ? (
          <p className="mt-8 border-[3px] border-ink bg-yellow px-5 py-4 text-sm font-bold">
            You&apos;re using all {MAX_PAGES_PER_USER} pages on the free plan.
            Delete one to make room — paid plans with more are coming later.
          </p>
        ) : null}
      </main>
    </>
  );
}
