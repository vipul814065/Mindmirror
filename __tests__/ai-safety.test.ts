import { describe, it, expect } from "vitest";
import {
  sanitizeUserInput,
  validateAIOutput,
  wrapUserContext,
} from "@/lib/ai/safety";

describe("ai safety", () => {
  it("strips control characters from user input", () => {
    expect(sanitizeUserInput("hello\x00world", 100)).toBe("helloworld");
  });

  it("truncates user input to max length", () => {
    expect(sanitizeUserInput("abcdefghij", 5)).toBe("abcde");
  });

  it("trims whitespace", () => {
    expect(sanitizeUserInput("  hello  ", 100)).toBe("hello");
  });

  it("validates AI output length", () => {
    const long = "a".repeat(5000);
    expect(validateAIOutput(long, 100).length).toBe(100);
  });

  it("wraps user context with delimiters", () => {
    const wrapped = wrapUserContext("test message");
    expect(wrapped).toContain("<user_context>");
    expect(wrapped).toContain("test message");
  });
});
