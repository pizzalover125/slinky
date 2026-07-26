import { describe, expect, it } from "vitest";
import { isHexColor, normalizeUrl, validateUsername } from "@/lib/validate";

describe("normalizeUrl", () => {
  it("rejects script-bearing protocols", () => {
    // These render into an href on a public page — a regression here is an XSS.
    expect(normalizeUrl("javascript:alert(1)")).toBeNull();
    expect(normalizeUrl("JaVaScRiPt:alert(1)")).toBeNull();
    expect(normalizeUrl("  javascript:alert(1)  ")).toBeNull();
    expect(normalizeUrl("data:text/html,<script>alert(1)</script>")).toBeNull();
    expect(normalizeUrl("vbscript:msgbox")).toBeNull();
    expect(normalizeUrl("file:///etc/passwd")).toBeNull();
  });

  it("rejects empty and hostless input", () => {
    expect(normalizeUrl("")).toBeNull();
    expect(normalizeUrl("   ")).toBeNull();
    expect(normalizeUrl("http://localhost")).toBeNull();
  });

  it("assumes https for bare domains", () => {
    expect(normalizeUrl("example.com/x")).toBe("https://example.com/x");
  });

  it("preserves explicit allowed protocols", () => {
    expect(normalizeUrl("https://a.co/b?c=1")).toBe("https://a.co/b?c=1");
    expect(normalizeUrl("http://a.co/")).toBe("http://a.co/");
    expect(normalizeUrl("mailto:me@a.co")).toBe("mailto:me@a.co");
  });
});

describe("validateUsername", () => {
  it("blocks names that would shadow app routes", () => {
    for (const name of ["dashboard", "api", "login", "go", "create"]) {
      expect(validateUsername(name).ok).toBe(false);
    }
  });

  it("enforces shape and length", () => {
    expect(validateUsername("ab").ok).toBe(false);
    expect(validateUsername("-abc").ok).toBe(false);
    expect(validateUsername("abc-").ok).toBe(false);
    expect(validateUsername("a b").ok).toBe(false);
    expect(validateUsername("a".repeat(31)).ok).toBe(false);
    expect(validateUsername("a".repeat(30)).ok).toBe(true);
    expect(validateUsername("my-page").ok).toBe(true);
  });

  it("normalizes case", () => {
    expect(validateUsername("AbC123")).toEqual({ ok: true, value: "abc123" });
  });
});

describe("isHexColor", () => {
  it("accepts 3- and 6-digit hex", () => {
    expect(isHexColor("#FF2D6B")).toBe(true);
    expect(isHexColor("#f0a")).toBe(true);
  });

  it("rejects anything that could break out of an inline style", () => {
    expect(isHexColor("red;}body{display:none")).toBe(false);
    expect(isHexColor("url(javascript:1)")).toBe(false);
    expect(isHexColor("rgb(0,0,0)")).toBe(false);
  });
});
