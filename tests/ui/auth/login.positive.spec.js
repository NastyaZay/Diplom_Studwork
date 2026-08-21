// UI-тест (позитив): успешный вход в studwork -> редирект на /orders.
// В конце сохраняет сессию в studwork.json

import { test, expect } from "../../../fixtures/index.js";
import { LoginUserBuilder } from "../../../ui/builders/index.js";

const STORAGE_STATE = "playwright/.auth/studwork.json";

test(
  "Успешный вход: после авторизации происходит переход на /orders",
  {
    // теги для фильтрации запуска: @ui - все UI-тесты, @auth - домен авторизации
    tag: ["@ui", "@auth"],
  },
  async ({ page, loginFacade }) => {
    // готовим валидные учетные данные (логин и пароль) из .env
    const user = new LoginUserBuilder().withValidCredentials().build();

    // выполняем весь вход одним вызовом фасада
    await loginFacade.loginFromHomePage({
      login: user.login,
      password: user.password,
    });

    // ждем редирект на страницу заказов
    await page.waitForURL((url) => url.pathname === "/orders");

    // проверяем, что мы на /orders и не вернулись на форму входа
    await expect(page).toHaveURL(/\/orders$/);
    await expect(page.getByRole("button", { name: "Войти" })).toHaveCount(0);

    // сохраняем сессию после успешных проверок
    await page.context().storageState({ path: STORAGE_STATE });
  },
);
