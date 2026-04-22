import { describe, it, expect } from "vitest";
import { loadTranslations } from "@/lib/i18n";

describe("loadTranslations", () => {
  it("returns an object keyed by namespace for 'es'", async () => {
    const result = await loadTranslations("es");
    expect(typeof result).toBe("object");
    expect(result).not.toBeNull();
  });

  it("returns an empty object for an unknown language without throwing", async () => {
    const result = await loadTranslations("xx-unknown");
    expect(result).toEqual({});
  });
});
