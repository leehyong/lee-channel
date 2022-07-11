import {describe, test, expect} from "@jest/globals";
import {get_model_id} from "../util";

describe("get_model_id", () => {
    test("get_model_id: AUTO", () => {
        const id = get_model_id("AUTO");
        expect(id).toBe(1);
    });
    test("get_model_id: UUID", () => {
        const id = get_model_id("UUID").toString();
        expect(id.length).toBe(32);
    });
    test("get_model_id: TIMESTAMP", () => {
        const id = get_model_id("TIMESTAMP");
        expect(id).toBeGreaterThan(0);
    });
});