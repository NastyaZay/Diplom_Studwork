// UI-фикстура: единый агрегатор фасадов StudworkApp.
// Создает StudworkApp через встроенную фикстуру `page` и отдает в тест как `app`.
//
// app держит фасады (app.login, app.wallet, app.shop, app.registration,
// app.qualification), а фасады скрывают за собой страницы (Page Object).

import { test as base } from "@playwright/test";
import { StudworkApp } from "../ui/facades/index.js";

// base.extend добавляет фикстуру app к встроенному test.
export const uiTest = base.extend({
  app: async ({ page }, use) => {
    await use(new StudworkApp(page));
  },
});
