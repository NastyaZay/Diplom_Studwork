// UI-тест (позитив): регистрация нового пользователя с подтверждением кодом из консоли.
// Стартует гостем. В конце сохраняет сессию в registered-user.json

import { test, expect } from "../../../fixtures/index.js";
import {
  RegistrationUserBuilder,
} from "../../../ui/builders/RegistrationUserBuilder.js";

const STORAGE_STATE = "playwright/.auth/registered-user.json";

test("Регистрация нового пользователя: подтверждение кодом, профиль активирован", async ({
  page,
  registrationFacade,
}) => {
  // готовим данные: уникальный email + валидный пароль (faker внутри билдера)
  const user = new RegistrationUserBuilder().withValidUser().build();

  // главная -> страница входа через "Авторизацию"
  await registrationFacade.openAuthFromHome();

  // проверяем заголовок "Вход"
  await expect(registrationFacade.signUpPage.loginHeading).toBeVisible();

  // переключаемся на таб "Регистрация"
  await registrationFacade.openRegistrationTab();

  // проверяем заголовок "Регистрация"
  await expect(registrationFacade.signUpPage.registrationHeading).toBeVisible();

  // заполняем форму: email, пароль, чекбокс согласия
  await registrationFacade.fillRegistrationForm(user);

  // нажимаем "Регистрация" и перехватываем код из консоли
  const code = await registrationFacade.submitAndCaptureCode();

  // код должен состоять ровно из 5 цифр
  expect(code).toMatch(/^\d{5}$/);

  // открылась модалка "Подтверждение регистрации"
  await expect(registrationFacade.confirmModal.heading).toBeVisible();

  // в модалке показана введенная почта
  await expect(registrationFacade.confirmModal.emailTarget).toHaveText(
    user.email,
  );

  // вводим 5 цифр кода
  await registrationFacade.enterConfirmCode(code);

  // после подтверждения - перенаправление на /info
  await page.waitForURL((url) => url.pathname === "/info");

  // проверяем заголовок "Профиль активирован"
  await expect(registrationFacade.profilePage.heading).toBeVisible();

  // сохраняем сессию нового пользователя
  await page.context().storageState({ path: STORAGE_STATE });
});
