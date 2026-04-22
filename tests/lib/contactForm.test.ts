import { describe, it, expect } from "vitest";
import {
  sanitizeCountryCode,
  sanitizePhone,
  pickFirstValidationError,
} from "@/lib/contactForm";

describe("sanitizeCountryCode", () => {
  it("keeps leading + and digits", () => {
    expect(sanitizeCountryCode("+57")).toBe("+57");
  });

  it("strips non-numeric characters", () => {
    expect(sanitizeCountryCode("+57abc")).toBe("+57");
  });

  it("removes + if not leading", () => {
    expect(sanitizeCountryCode("57+1")).toBe("571");
  });

  it("collapses multiple + signs to at most one leading", () => {
    expect(sanitizeCountryCode("++57")).toBe("+57");
  });

  it("handles empty string", () => {
    expect(sanitizeCountryCode("")).toBe("");
  });

  it("handles only +", () => {
    expect(sanitizeCountryCode("+")).toBe("+");
  });
});

describe("sanitizePhone", () => {
  it("preserves digits and spaces", () => {
    expect(sanitizePhone("300 123 4567")).toBe("300 123 4567");
  });

  it("strips letters", () => {
    expect(sanitizePhone("300abc123")).toBe("300123");
  });

  it("strips symbols", () => {
    expect(sanitizePhone("+300-123-4567")).toBe("3001234567");
  });
});

describe("pickFirstValidationError", () => {
  it("returns the first error for the first field", () => {
    const body = {
      errors: {
        email: ["Email is required", "Must be valid"],
        name: ["Name too short"],
      },
    };
    expect(pickFirstValidationError(body)).toBe("Email is required");
  });

  it("returns null when there are no errors", () => {
    expect(pickFirstValidationError({})).toBeNull();
  });

  it("returns null when errors is empty object", () => {
    expect(pickFirstValidationError({ errors: {} })).toBeNull();
  });

  it("returns null when first field has an empty array", () => {
    expect(pickFirstValidationError({ errors: { email: [] } })).toBeNull();
  });
});
