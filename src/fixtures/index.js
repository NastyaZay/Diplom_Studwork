import { mergeTests, expect } from "@playwright/test";
import { uiTest } from "./ui.js";
import { apiTest } from "./api.js";

export const test = mergeTests(uiTest, apiTest);
export { expect };
