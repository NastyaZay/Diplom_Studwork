// UI-тест (позитив): отправка формы квалификации с валидными данными
// Предусловие: идет ПОСЛЕ регистрации
// Тест работает со страницами напрямую через app:
// app.headerMenu, app.specializationPage, app.qualificationPage.

import path from "path";
import { fileURLToPath } from "url";
import { test, expect } from "../../../src/fixtures/index.js";
import { QualificationBuilder } from "../../../src/ui/builders/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// тестовый файл (jpg до 2 Мб), путь от корня проекта
const DIPLOMA_FILE = path.resolve(
  __dirname,
  "../../test-files/qualification-diploma.jpg",
);

test(
  "Отправка формы квалификации: валидные данные + чекбокс -> запрос отправлен",
  {
    // теги для фильтрации запуска: @ui - все UI-тесты, @specialization - домен специализаций
    tag: ["@ui", "@specialization"],
  },
  async ({ page, app }) => {
    // готовим данные: ФИО и ссылка (faker внутри билдера)
    const data = new QualificationBuilder().withValidData().build();

    // стартуем со страницы заказов (точка входа зарегистрированного пользователя)
    await app.ordersPage.open();
    await page.waitForURL((url) => url.pathname === "/orders");

    // переходим в "Специализации" через боковое меню
    await app.headerMenu.openSpecialization();
    await page.waitForURL((url) => url.pathname === "/info/specialization");

    // проверяем заголовок и информер на странице специализаций
    await expect(app.specializationPage.heading).toBeVisible();
    await expect(app.specializationPage.infoAlert).toBeVisible();

    // открываем форму квалификации кнопкой "Заполнить данные"
    await app.specializationPage.clickFillData();
    await page.waitForURL(
      (url) => url.pathname === "/info/specialization/qualification",
    );

    // проверяем заголовок "Подтверждение квалификации"
    await expect(app.qualificationPage.heading).toBeVisible();

    // заполняем форму (ФИО, ссылка, файл)
    await app.qualificationPage.fillForm(data, DIPLOMA_FILE);

    // проверяем, что имя загруженного файла отобразилось
    await expect(app.qualificationPage.uploadedFileName).toBeVisible();

    // ставим согласие и отправляем запрос
    await app.qualificationPage.acceptConsent();
    await app.qualificationPage.clickSubmit();

    // возврат на страницу специализаций
    await page.waitForURL((url) => url.pathname === "/info/specialization");

    // тост успеха об отправке запроса
    await expect(app.specializationPage.requestSentToast).toBeVisible();

    // после отправки текст информера меняется на "Ваш запрос принят..."
    await expect(app.specializationPage.infoAlert).toContainText(
      "Ваш запрос принят",
    );
  },
);
