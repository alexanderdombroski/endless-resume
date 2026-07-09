import { describe, it, expect } from "vitest";
import {
  hasEndingPeriod,
  hasStartingPeriod,
  addEndingPeriod,
  removeEndingPeriod,
  addStartingPeriod,
  removeStartingPeriod
} from "./string";

describe("String Punctuation Utilities", () => {
  describe("hasEndingPeriod", () => {
    it("returns true if string ends with period", () => {
      expect(hasEndingPeriod("hello.")).toBe(true);
      expect(hasEndingPeriod("hello.   ")).toBe(true);
    });

    it("returns false if string does not end with period", () => {
      expect(hasEndingPeriod("hello")).toBe(false);
      expect(hasEndingPeriod("")).toBe(false);
      expect(hasEndingPeriod("hello.world")).toBe(false);
    });
  });

  describe("hasStartingPeriod", () => {
    it("returns true if string starts with period", () => {
      expect(hasStartingPeriod(".hello")).toBe(true);
      expect(hasStartingPeriod("   .hello")).toBe(true);
    });

    it("returns false if string does not start with period", () => {
      expect(hasStartingPeriod("hello")).toBe(false);
      expect(hasStartingPeriod("")).toBe(false);
    });
  });

  describe("addEndingPeriod", () => {
    it("adds period if string does not end with one", () => {
      expect(addEndingPeriod("hello")).toBe("hello.");
    });

    it("does not add period if string already ends with one", () => {
      expect(addEndingPeriod("hello.")).toBe("hello.");
    });

    it("returns empty string unmodified", () => {
      expect(addEndingPeriod("")).toBe("");
    });
  });

  describe("removeEndingPeriod", () => {
    it("removes period from the end of the string", () => {
      expect(removeEndingPeriod("hello.")).toBe("hello");
      expect(removeEndingPeriod("hello.   ")).toBe("hello   ");
    });

    it("does not modify string if it does not end with period", () => {
      expect(removeEndingPeriod("hello")).toBe("hello");
    });
  });

  describe("addStartingPeriod", () => {
    it("adds period to start of string", () => {
      expect(addStartingPeriod("hello")).toBe(".hello");
    });

    it("does not add period if string starts with one", () => {
      expect(addStartingPeriod(".hello")).toBe(".hello");
    });
  });

  describe("removeStartingPeriod", () => {
    it("removes period from start of string", () => {
      expect(removeStartingPeriod(".hello")).toBe("hello");
      expect(removeStartingPeriod("   .hello")).toBe("   hello");
    });

    it("does not modify string if it does not start with period", () => {
      expect(removeStartingPeriod("hello")).toBe("hello");
    });
  });
});
