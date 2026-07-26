import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { StepFooter } from "@/components/builder/step-nav";
import { Chip } from "@/components/ui/card";
import { isSupabaseConfigured, siteUrl } from "@/lib/supabase/env";
import { getUser } from "@/lib/supabase/server";
import { MAX_PAGES_PER_USER } from "@/lib/types";
import { PublishForm } from "./publish-form";

export const metadata = { title: "Publish" };

export default async function PublishStep() {
  const user = isSupabaseConfigured ? await getUser() : null;
  const host = new URL(siteUrl()).host;

  return (
    <section>
      <Chip tone="hot">Step 4</Chip>
      <h1 className="mt-4 text-5xl">Ship it.</h1>

      <div className="mt-8 border-[3px] border-ink bg-white p-6 shadow-brut">
        {!isSupabaseConfigured ? (
          <p className="border-[3px] border-ink bg-yellow px-4 py-3 text-sm font-bold">
            Supabase isn&apos;t configured yet, so publishing is switched off.
            Add your keys to <code className="mx-1">.env.local</code> to turn it
            on. Everything else in the builder works.
          </p>
        ) : user ? (
          <PublishForm siteHost={host} />
        ) : (
          <div>
            <h2 className="text-2xl">One account, three pages, no charge.</h2>
            <p className="mt-3 text-ink/70">
              Your draft is saved in this browser and comes with you through
              sign-in — nothing you&apos;ve built gets lost.
            </p>
            <div className="mt-6">
              <OAuthButtons next="/create/publish" />
            </div>
          </div>
        )}
      </div>

      <p className="mt-4 text-sm text-ink/60">
        Free plan: up to {MAX_PAGES_PER_USER} pages. No custom domains yet —
        that&apos;s coming in v2.
      </p>

      <StepFooter back="/create/customize" />
    </section>
  );
}
