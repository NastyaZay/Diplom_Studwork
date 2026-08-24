// UI-тест: приложение доступно авторизованному пользователю на сайте (сессия из setup).

import { test, expect } from "../../../src/fixtures/index.js";

test(
  "Авторизованному пользователю доступна главная страница без повторного входа",
  {
    // теги для фильтрации запуска: @ui - все UI-тесты, @auth - домен авторизации
    tag: ["@ui", "@auth"],
  },
  async ({ page, app }) => {
    // открываем главную (точка входа app.homePage)
    await app.homePage.open();

    // отсутствие кнопки входа = мы авторизованы
    await expect(
      page.getByRole("button", { name: "Sign in with Dex" }),
    ).toHaveCount(0);
  },
);
