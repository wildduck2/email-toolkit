import { it, describe, expect } from "vitest";
import { Sum } from "./index";

describe("Sum", () => {
    it("should add two numbers", () => {
        expect(Sum(1, 2)).toEqual(3);
    });
});
