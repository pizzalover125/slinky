import { describe, expect, it } from "vitest";
import { sanitizeDraft } from "@/lib/sanitize";

const UUID = "3f2504e0-4f89-41d3-9a0c-0305e82c3301";

describe("sanitizeDraft", () => {
  it("rejects input with no usable username", () => {
    expect(sanitizeDraft(null).ok).toBe(false);
    expect(sanitizeDraft({}).ok).toBe(false);
    expect(sanitizeDraft({ username: "" }).ok).toBe(false);
  });

  it("scrubs a hostile draft down to safe values", () => {
    const result = sanitizeDraft({
      username: "Evil-User",
      themeId: "../../etc/passwd",
      profile: {
        displayName: "x".repeat(500),
        bio: "y".repeat(500),
        avatarUrl: "javascript:alert(1)",
      },
      customization: {
        accent: "red;}body{display:none}",
        border: "#ABCDEF",
        background: {
          type: "pattern",
          pattern: "'; DROP TABLE links; --",
          color: "#000000",
          on: "#FFFFFF",
        },
      },
      links: [
        { id: "not-a-uuid", title: "js", url: "javascript:alert(1)" },
        { id: UUID, title: "good", url: "example.com" },
        { title: "", url: "https://a.co" },
        { title: "no url", url: "" },
      ],
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const v = result.value;

    expect(v.username).toBe("evil-user");
    expect(v.themeId).toBe("concrete");
    expect(v.displayName).toHaveLength(50);
    expect(v.bio).toHaveLength(160);
    expect(v.avatarUrl).toBeNull();
    expect(v.customization.accent).toBeNull();
    expect(v.customization.border).toBe("#ABCDEF");
    expect(v.customization.background).toEqual({ type: "theme" });

    // The javascript: link and both half-filled rows are dropped.
    expect(v.links).toHaveLength(1);
    expect(v.links[0].url).toBe("https://example.com/");
    expect(v.links[0].position).toBe(0);
  });

  it("keeps a real link id so click counts survive an edit", () => {
    const result = sanitizeDraft({
      username: "abc",
      links: [{ id: UUID, title: "t", url: "a.co" }],
    });
    expect(result.ok && result.value.links[0].id).toBe(UUID);
  });

  it("drops a forged link id rather than trusting it", () => {
    const result = sanitizeDraft({
      username: "abc",
      links: [{ id: "not-a-uuid", title: "t", url: "a.co" }],
    });
    expect(result.ok && result.value.links[0].id).toBeUndefined();
  });

  it("reindexes positions after dropping invalid rows", () => {
    const result = sanitizeDraft({
      username: "abc",
      links: [
        { title: "bad", url: "javascript:1" },
        { title: "a", url: "a.co" },
        { title: "b", url: "b.co" },
      ],
    });
    expect(result.ok && result.value.links.map((l) => l.position)).toEqual([
      0, 1,
    ]);
  });

  it("falls back to the username when no display name is given", () => {
    const result = sanitizeDraft({ username: "abc", profile: {} });
    expect(result.ok && result.value.displayName).toBe("abc");
  });
});
