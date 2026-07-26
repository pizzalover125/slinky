import Link from "next/link";
import { redirect } from "next/navigation";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { Logo } from "@/components/logo";
import { Card } from "@/components/ui/card";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getUser } from "@/lib/supabase/server";

export const metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;

  if (isSupabaseConfigured) {
    const user = await getUser();
    if (user) redirect("/dashboard");
  }

  return (
    <main className="flex flex-1 items-center justify-center px-5 py-16">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex justify-center" aria-label="slinky home">
          <Logo markClassName="h-9" className="[&>span]:text-3xl" />
        </Link>

        <Card className="p-8">
          <h1 className="text-4xl">Sign in.</h1>
          <p className="mt-3 text-ink/70">
            Publishing needs an account — up to three pages, no charge. We only
            do OAuth, so there&apos;s no password to lose.
          </p>

          <div className="mt-7">
            {isSupabaseConfigured ? (
              <OAuthButtons next={next} />
            ) : (
              <p className="border-[3px] border-ink bg-yellow px-4 py-3 text-sm font-bold">
                Supabase isn&apos;t configured yet. Add your keys to
                <code className="mx-1">.env.local</code> to enable sign-in.
              </p>
            )}
          </div>

          {error ? (
            <p
              className="mt-4 border-[3px] border-ink bg-hot px-4 py-3 text-sm font-bold text-white"
              role="alert"
            >
              {error === "missing_code"
                ? "That sign-in link was incomplete. Try again."
                : error}
            </p>
          ) : null}
        </Card>

        <p className="mt-6 text-center text-sm text-ink/60">
          Your draft stays in this browser until you publish it.
        </p>
      </div>
    </main>
  );
}
