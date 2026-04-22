import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { getRelativeTime, formatDate, type RelativeTimeDict } from "@/lib/date";

const dict: RelativeTimeDict = {
  prefix: "hace ",
  suffix: "",
  seconds: "unos segundos",
  minute: "minuto",
  minutes: "minutos",
  hour: "hora",
  hours: "horas",
  day: "día",
  days: "días",
  week: "semana",
  weeks: "semanas",
  month: "mes",
  months: "meses",
  year: "año",
  years: "años",
};

const NOW = new Date(2026, 3, 21, 12, 0, 0);

function fromNow(secondsAgo: number): string {
  const d = new Date(NOW.getTime() - secondsAgo * 1000);
  const pad = (n: number) => n.toString().padStart(2, "0");
  // Build as "YYYY-MM-DD HH:mm:ss" in local time to match the function's parsing.
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

describe("getRelativeTime", () => {
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it("returns 'seconds' label for <60s", () => {
    expect(getRelativeTime(fromNow(30), dict)).toBe("hace unos segundos");
  });

  it("uses singular minute for 1 min", () => {
    expect(getRelativeTime(fromNow(60), dict)).toBe("hace 1 minuto");
  });

  it("uses plural minutes for >1 min", () => {
    expect(getRelativeTime(fromNow(60 * 5), dict)).toBe("hace 5 minutos");
  });

  it("uses singular hour", () => {
    expect(getRelativeTime(fromNow(3600), dict)).toBe("hace 1 hora");
  });

  it("uses plural days", () => {
    expect(getRelativeTime(fromNow(86400 * 3), dict)).toBe("hace 3 días");
  });

  it("uses plural weeks", () => {
    expect(getRelativeTime(fromNow(604800 * 2), dict)).toBe("hace 2 semanas");
  });

  it("uses plural months", () => {
    expect(getRelativeTime(fromNow(2592000 * 4), dict)).toBe("hace 4 meses");
  });

  it("uses plural years", () => {
    expect(getRelativeTime(fromNow(31536000 * 2), dict)).toBe("hace 2 años");
  });
});

describe("formatDate", () => {
  it("formats a date in spanish by default", () => {
    const result = formatDate("2025-09-19 00:00:00");
    expect(result).toContain("2025");
    expect(result.toLowerCase()).toContain("septiembre");
  });

  it("formats a date in english when lang=en", () => {
    const result = formatDate("2025-09-19 00:00:00", "en");
    expect(result).toContain("2025");
    expect(result.toLowerCase()).toContain("september");
  });
});
