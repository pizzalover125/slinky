"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Chip } from "@/components/ui/card";
import type { SlinkyPage } from "@/lib/types";
import { deletePage, setPublished } from "./actions";
import { cn } from "@/lib/cn";

export function PageCard({
  page,
  siteHost,
}: {
  page: SlinkyPage;
  siteHost: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalClicks = page.links.reduce(
    (sum, link) => sum + (link.clickCount ?? 0),
    0,
  );
  const activeCount = page.links.filter((l) => l.active).length;

  function onDelete() {
    startTransition(async () => {
      const result = await deletePage(page.id);
      if (!result.ok) {
        setError(result.error);
        setConfirming(false);
        return;
      }
      router.refresh();
    });
  }

  function onTogglePublished() {
    startTransition(async () => {
      const result = await setPublished(page.id, !page.published);
      if (!result.ok) setError(result.error);
      else router.refresh();
    });
  }

  return (
    <article className="border-[3px] border-ink bg-white shadow-brut-lg">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b-[3px] border-ink p-5">
        <div className="min-w-0">
          <h2 className="truncate text-2xl">
            {page.profile.displayName || page.username}
          </h2>
          <a
            href={`/${page.username}`}
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-block truncate text-sm text-ink/60 underline decoration-dotted underline-offset-4 hover:text-hot"
          >
            {siteHost}/{page.username} ↗
          </a>
        </div>
        <Chip tone={page.published ? "mint" : "white"}>
          {page.published ? "Live" : "Hidden"}
        </Chip>
      </div>

      <dl className="grid grid-cols-3 divide-x-[3px] divide-ink border-b-[3px] border-ink text-center">
        {[
          { label: "Links", value: page.links.length },
          { label: "Live", value: activeCount },
          { label: "Clicks", value: totalClicks },
        ].map((stat) => (
          <div key={stat.label} className="px-2 py-4">
            <dd className="font-display text-3xl tabular-nums">{stat.value}</dd>
            <dt className="mt-1 text-[10px] font-bold uppercase tracking-widest text-ink/50">
              {stat.label}
            </dt>
          </div>
        ))}
      </dl>

      {page.links.length > 0 ? (
        <ul className="divide-y-[3px] divide-ink/10 border-b-[3px] border-ink">
          {page.links.slice(0, 4).map((link) => (
            <li
              key={link.id}
              className="flex items-center justify-between gap-3 px-5 py-2.5 text-sm"
            >
              <span
                className={cn("min-w-0 truncate", !link.active && "text-ink/40 line-through")}
              >
                {link.title}
              </span>
              <span className="shrink-0 tabular-nums text-ink/50">
                {link.clickCount ?? 0}
              </span>
            </li>
          ))}
          {page.links.length > 4 ? (
            <li className="px-5 py-2.5 text-sm text-ink/50">
              +{page.links.length - 4} more
            </li>
          ) : null}
        </ul>
      ) : null}

      <div className="flex flex-wrap gap-2 p-4">
        <Link
          href={`/dashboard/${page.id}`}
          className="border-[3px] border-ink bg-hot px-4 py-2 text-sm font-bold uppercase tracking-widest text-white shadow-brut-sm brut-press"
        >
          Edit
        </Link>
        <button
          type="button"
          onClick={onTogglePublished}
          disabled={pending}
          className="border-[3px] border-ink bg-white px-4 py-2 text-sm font-bold uppercase tracking-widest shadow-brut-sm brut-press disabled:opacity-50"
        >
          {page.published ? "Hide" : "Publish"}
        </button>

        {confirming ? (
          <span className="flex items-center gap-2">
            <button
              type="button"
              onClick={onDelete}
              disabled={pending}
              className="border-[3px] border-ink bg-ink px-4 py-2 text-sm font-bold uppercase tracking-widest text-white shadow-brut-sm disabled:opacity-50"
            >
              {pending ? "Deleting…" : "Really delete"}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="text-sm font-bold uppercase tracking-widest underline"
            >
              Cancel
            </button>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="ml-auto border-[3px] border-ink bg-white px-4 py-2 text-sm font-bold uppercase tracking-widest shadow-brut-sm brut-press hover:bg-hot hover:text-white"
          >
            Delete
          </button>
        )}
      </div>

      {error ? (
        <p className="border-t-[3px] border-ink bg-hot px-5 py-3 text-sm font-bold text-white" role="alert">
          {error}
        </p>
      ) : null}
    </article>
  );
}
