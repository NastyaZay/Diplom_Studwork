// UI-тест (позитив): отправка формы квалификации с валидными данными
// Предусловие: идет ПОСЛЕ регистрации

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

    // КОНТРОЛЬНАЯ ТОЧКА 1: переходим в "Специализации" через боковое меню
    await app.qualification.openSpecialization();
    await page.waitForURL((url) => url.pathname === "/info/specialization");

    // проверяем заголовок и информер (геттеры фасада)
    await expect(app.qualification.specializationHeading).toBeVisible();
    await expect(app.qualification.infoAlert).toBeVisible();

    // КОНТРОЛЬНАЯ ТОЧКА 2: открываем форму квалификации кнопкой "Заполнить данные"
    await app.qualification.openQualificationForm();
    await page.waitForURL(
      (url) => url.pathname === "/info/specialization/qualification",
    );

    // проверяем заголовок "Подтверждение квалификации" (геттер фасада)
    await expect(app.qualification.qualificationHeading).toBeVisible();

    // КОНТРОЛЬНАЯ ТОЧКА 3: заполняем форму (ФИО, ссылка, файл)
    await app.qualification.fillQualificationForm(data, DIPLOMA_FILE);

    // проверяем, что имя загруженного файла отобразилось (геттер фасада)
    await expect(app.qualification.uploadedFileName).toBeVisible();

    // КОНТРОЛЬНАЯ ТОЧКА 4: ставим согласие и отправляем запрос
    await app.qualification.acceptAndSubmit();

    // возврат на страницу специализаций
    await page.waitForURL((url) => url.pathname === "/info/specialization");

    // тост успеха об отправке запроса (геттер фасада)
    await expect(app.qualification.requestSentToast).toBeVisible();

    // после отправки текст информера меняется на "Ваш запрос принят..." (геттер фасада)
    await expect(app.qualification.infoAlert).toContainText(
      "Ваш запрос принят",
    );
  },
);
