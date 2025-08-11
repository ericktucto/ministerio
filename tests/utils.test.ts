import { showHuman } from "@/utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
describe("Different of date to humans", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    const date = new Date(2025, 7, 8, 12, 0, 0);
    vi.setSystemTime(date);
  });
  afterEach(() => {
    vi.useRealTimers();
  });
  it("When different is one week, return long format date", () => {
    const from = new Date(2025, 7, 1, 12, 0, 0);
    const diff = showHuman(from);
    expect(diff).toBe("viernes 01 de agosto del 2025 12:00 PM");
  });
  it("When different is less one week, return short format date", () => {
    const cases: [number, string][] = [
      [8, 'hoy a las 11:00 AM'],
      [7, 'ayer a las 11:00 AM'],
      [6, 'miércoles a las 11:00 AM'],
      [5, 'martes a las 11:00 AM'],
      [4, 'lunes a las 11:00 AM'],
      [3, 'domingo a las 11:00 AM'],
      [2, 'sábado a las 11:00 AM'],
    ]
    cases.forEach((item) => {
      const [day, expected] = item
      const from = new Date(2025, 7, day, 11, 0, 0);
      const diff = showHuman(from);
      expect(diff).toBe(expected);
    })
  });
});
