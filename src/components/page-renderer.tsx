import Link from "next/link";
import { getTheme, themeToStyle } from "@/lib/themes";
import type { Customization, PageProfile, SlinkyLink } from "@/lib/types";
import { cn } from "@/lib/cn";

interface PageRendererProps {
  themeId: string;
  profile: PageProfile;
  customization: Customization;
  links: SlinkyLink[];
  /**
   * Preview mode renders links as inert spans — so clicking inside the
   * builder never navigates away or inflates a click count.
   */
  preview?: boolean;
  /** Builds the outbound href; the public page routes through /go for counting. */
  hrefFor?: (link: SlinkyLink) => string;
  className?: string;
}

export function PageRenderer({
  themeId,
  profile,
  customization,
  links,
  preview = false,
  hrefFor,
  className,
}: PageRendererProps) {
  const theme = getTheme(themeId);
  const style = themeToStyle(theme, customization);
  const visible = links
    .filter((l) => l.active)
    .sort((a, b) => a.position - b.position);

  const initials =
    profile.displayName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "?";

  return (
    <div
      style={style}
      className={cn(
        "flex min-h-full w-full flex-col items-center px-5 py-14",
        "bg-[var(--sl-bg)] bg-[image:var(--sl-bg-image)] bg-[length:var(--sl-bg-size)]",
        "font-[family-name:var(--sl-font-body)] text-[var(--sl-text)]",
        className,
      )}
    >
      <div className="flex w-full max-w-md flex-col items-center">
        <div
          className="mb-4 flex h-20 w-20 items-center justify-center overflow-hidden border-[length:var(--sl-border-width)] border-[var(--sl-border)] bg-[var(--sl-surface)] text-[var(--sl-surface-text)]"
          style={{ borderRadius: "var(--sl-avatar-radius)" }}
        >
          {profile.avatarUrl ? (
            // Avatars are arbitrary user URLs; next/image would need per-host config.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatarUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="font-[family-name:var(--sl-font-display)] text-2xl">
              {initials}
            </span>
          )}
        </div>

        <h1
          className="text-center font-[family-name:var(--sl-font-display)] text-3xl tracking-[var(--sl-tracking)]"
          style={{ color: "var(--sl-text)" }}
        >
          {profile.displayName || "Your name"}
        </h1>

        {profile.bio ? (
          <p className="mt-2 max-w-xs text-center text-sm text-[var(--sl-muted)]">
            {profile.bio}
          </p>
        ) : null}

        <ul
          className="mt-8 flex w-full flex-col"
          style={{ gap: "var(--sl-gap)" }}
        >
          {visible.map((link) => {
            const content = (
              <>
                <span className="min-w-0 flex-1 truncate">{link.title}</span>
                <span
                  aria-hidden="true"
                  className="shrink-0 text-[var(--sl-accent)]"
                >
                  ↗
                </span>
              </>
            );

            const shared = cn(
              "group flex w-full items-center gap-3 text-center",
              "border-[length:var(--sl-border-width)] border-[var(--sl-border)]",
              "bg-[var(--sl-surface)] text-[var(--sl-surface-text)]",
              "font-[weight:var(--sl-link-weight)] tracking-[var(--sl-tracking)]",
              "transition-[box-shadow,transform] duration-100 motion-reduce:transition-none",
            );

            const inlineStyle: React.CSSProperties = {
              borderRadius: "var(--sl-radius)",
              padding: "var(--sl-link-padding)",
              boxShadow: "var(--sl-shadow)",
              textTransform:
                theme.shape.linkTransform === "uppercase"
                  ? "uppercase"
                  : "none",
            };

            return (
              <li key={link.id}>
                {preview ? (
                  <span className={shared} style={inlineStyle}>
                    {content}
                  </span>
                ) : (
                  <a
                    href={hrefFor ? hrefFor(link) : link.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow ugc"
                    className={cn(shared, "hover:shadow-[var(--sl-shadow-hover)]")}
                    style={inlineStyle}
                  >
                    {content}
                  </a>
                )}
              </li>
            );
          })}
        </ul>

        {visible.length === 0 ? (
          <p className="mt-8 text-center text-sm text-[var(--sl-muted)]">
            No links yet.
          </p>
        ) : null}

        <Link
          href="/"
          className="mt-14 text-xs text-[var(--sl-muted)] underline decoration-dotted underline-offset-4 opacity-70 transition-opacity hover:opacity-100"
        >
          built with slinky
        </Link>
      </div>
    </div>
  );
}
