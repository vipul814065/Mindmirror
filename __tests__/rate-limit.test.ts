import { describe, it, expect, beforeEach } from "vitest";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit";

describe("rate-limit", () => {
  beforeEach(() => {
    resetRateLimit();
  });

  it("allows requests within limit", () => {
    expect(checkRateLimit("test", 3, 60_000)).toBe(true);
    expect(checkRateLimit("test", 3, 60_000)).toBe(true);
    expect(checkRateLimit("test", 3, 60_000)).toBe(true);
  });

  it("blocks requests over limit", () => {
    checkRateLimit("coach", 2, 60_000);
    checkRateLimit("coach", 2, 60_000);
    expect(checkRateLimit("coach", 2, 60_000)).toBe(false);
  });

  it("resets bucket for key", () => {
    checkRateLimit("journal", 1, 60_000);
    expect(checkRateLimit("journal", 1, 60_000)).toBe(false);
    resetRateLimit("journal");
    expect(checkRateLimit("journal", 1, 60_000)).toBe(true);
  });
});
