// UI-тест (позитив): отправка формы квалификации с валидными данными
// Предусловие: идет ПОСЛЕ регистрации

import path from "path";
import { fileURLToPath } from "url";
import { test, expect } from "../../../fixtures/index.js";
import { QualificationBuilder } from "../../../ui/builders/index.js";

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
  async ({ page, qualificationFacade, ordersPage }) => {
    // готовим данные: ФИО и ссылка (faker внутри билдера)
    const data = new QualificationBuilder().withValidData().build();

    // открываем страницу
    await ordersPage.open();
    await page.waitForURL((url) => url.pathname === "/orders");

    // переходим в "Специализации" через боковое меню
    await qualificationFacade.openSpecialization();
    await page.waitForURL((url) => url.pathname === "/info/specialization");

    // проверяем заголовок "Специализации"
    await expect(qualificationFacade.specializationPage.heading).toBeVisible();

    // проверяем отображение информера
    await expect(
      qualificationFacade.specializationPage.infoAlert,
    ).toBeVisible();

    // открываем форму квалификации кнопкой "Заполнить данные"
    await qualificationFacade.openQualificationForm();
    await page.waitForURL(
      (url) => url.pathname === "/info/specialization/qualification",
    );

    // проверяем заголовок "Подтверждение квалификации"
    await expect(qualificationFacade.qualificationPage.heading).toBeVisible();

    // заполняем форму: ФИО, ссылка, файл
    await qualificationFacade.fillQualificationForm(data, DIPLOMA_FILE);

    // проверяем, что имя загруженного файла отобразилось
    await expect(
      qualificationFacade.qualificationPage.uploadedFileName,
    ).toBeVisible();

    // ставим чекбокс согласия
    await qualificationFacade.acceptConsent();

    // отправляем запрос
    await qualificationFacade.submitQualification();

    // возврат на страницу специализаций
    await page.waitForURL((url) => url.pathname === "/info/specialization");

    // тост успеха об отправке запроса
    await expect(
      page.getByText("Запрос на подтверждение квалификации успешно отправлен", {
        exact: false,
      }),
    ).toBeVisible();

    // после отправки текст информера меняется на "Ваш запрос принят..."
    await expect(
      qualificationFacade.specializationPage.infoAlert,
    ).toContainText("Ваш запрос принят");
  },
);
