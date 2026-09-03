// UI-тест (позитив): регистрация нового пользователя с подтверждением кодом из консоли.
// Стартует гостем. В конце сохраняет сессию в registered-user.json
//
// Слоя-фасада для регистрации нет: три страницы раздаются напрямую через app
// (app.homePage, app.signUpPage, app.confirmModal, app.profilePage).
// Подсистема 2FA (перехват кода из консоли) спрятана в RegistrationConfirmModal.

import { test, expect } from "../../../src/fixtures/index.js";
import { RegistrationUserBuilder } from "../../../src/ui/builders/index.js";

const STORAGE_STATE = "playwright/.auth/registered-user.json";

test(
  "Регистрация нового пользователя: подтверждение кодом, профиль активирован",
  {
    // теги для фильтрации запуска: @ui - все UI-тесты, @auth - домен авторизации
    tag: ["@ui", "@auth"],
  },
  async ({ page, app }) => {
    // готовим данные: уникальный email + валидный пароль (faker внутри билдера)
    const user = new RegistrationUserBuilder().withValidUser().build();

    // открываем главную и переходим на страницу входа кнопкой "Авторизация"
    await app.homePage.open();
    await app.homePage.clickAuth();

    // на экране виден заголовок "Вход" (проверяем ДО переключения таба)
    await expect(app.signUpPage.loginHeading).toBeVisible();

    // переключаемся на таб "Регистрация"
    await app.signUpPage.openRegistrationTab();

    // теперь виден заголовок "Регистрация" (таб переключился)
    await expect(app.signUpPage.registrationHeading).toBeVisible();

    // заполняем форму регистрации (email, пароль, согласие)
    await app.signUpPage.fillRegistrationForm(user);

    // жмем "Регистрация" и перехватываем код из консоли.
    // Механика перехвата спрятана в captureConfirmCode - тест видит только код.
    const code = await app.confirmModal.captureConfirmCode(() =>
      app.signUpPage.clickRegistration(),
    );

    // код должен состоять ровно из 5 цифр
    expect(code).toMatch(/^\d{5}$/);

    // открылась модалка "Подтверждение регистрации"
    await expect(app.confirmModal.heading).toBeVisible();

    // в модалке показана введенная почта
    await expect(app.confirmModal.emailTarget).toHaveText(user.email);

    // вводим перехваченный код в поля подтверждения
    await app.confirmModal.fillCode(code);

    // после подтверждения - перенаправление на /info
    await page.waitForURL((url) => url.pathname === "/info");

    // заголовок "Профиль активирован"
    await expect(app.profilePage.heading).toBeVisible();

    // сохраняем сессию нового пользователя
    await page.context().storageState({ path: STORAGE_STATE });
  },
);
