// UI-фикстура: единый агрегатор фасадов StudworkApp.
// Создает StudworkApp через встроенную фикстуру `page` и отдает в тест как `app`.
//
// app держит фасады там, где есть подсистема (app.wallet - 2FA счетов,
// app.shop - навигация до формы), а остальные домены (вход, регистрация,
// квалификация) раздаются страницами напрямую: app.loginPage, app.signUpPage и др.

import { test as base } from "@playwright/test";
import { StudworkApp } from "../ui/facades/index.js";

// base.extend добавляет фикстуру app к встроенному test.
export const uiTest = base.extend({
  app: async ({ page }, use) => {
    await use(new StudworkApp(page));
  },
});
