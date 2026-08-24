// UI-тест (позитив): регистрация нового пользователя с подтверждением кодом из консоли.
// Стартует гостем. В конце сохраняет сессию в registered-user.json

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

    // КОНТРОЛЬНАЯ ТОЧКА 1: открываем страницу входа (главная -> Авторизация)
    await app.registration.openAuthPage();

    // на экране виден заголовок "Вход" (проверяем ДО переключения таба)
    await expect(app.registration.loginHeading).toBeVisible();

    // КОНТРОЛЬНАЯ ТОЧКА 2: переключаемся на таб "Регистрация"
    await app.registration.openRegistrationTab();

    // теперь виден заголовок "Регистрация" (таб переключился)
    await expect(app.registration.registrationHeading).toBeVisible();

    // КОНТРОЛЬНАЯ ТОЧКА 3: заполнить форму, отправить, перехватить код, ввести код.
    // Фасад возвращает перехваченный код для проверки формата.
    const code = await app.registration.submitRegistration(user);

    // код должен состоять ровно из 5 цифр
    expect(code).toMatch(/^\d{5}$/);

    // открылась модалка "Подтверждение регистрации" (геттер фасада)
    await expect(app.registration.confirmHeading).toBeVisible();

    // в модалке показана введенная почта (геттер фасада)
    await expect(app.registration.emailTarget).toHaveText(user.email);

    // после подтверждения - перенаправление на /info
    await page.waitForURL((url) => url.pathname === "/info");

    // заголовок "Профиль активирован" (геттер фасада)
    await expect(app.registration.profileHeading).toBeVisible();

    // сохраняем сессию нового пользователя
    await page.context().storageState({ path: STORAGE_STATE });
  },
);
