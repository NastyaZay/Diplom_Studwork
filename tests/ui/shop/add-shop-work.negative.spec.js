// UI-тест (негатив): пустая форма новой работы -> ошибки валидации.
// Стартует залогиненным (studwork.json).
//
// Действие (путь до формы + сабмит пустой) прячет фасад app.shop.
// Проверки ошибок тест берет из самой формы напрямую - app.newWorkPage.

import { test, expect } from "../../../src/fixtures/index.js";

test(
  "Добавление работы: пустая форма показывает ошибки валидации",
  {
    // теги для фильтрации запуска: @ui - все UI-тесты, @shop - домен магазина
    tag: ["@ui", "@shop"],
  },
  async ({ page, app }) => {
    // стартуем со страницы заказов (точка входа залогиненного пользователя)
    await app.ordersPage.open();
    await expect(page).toHaveURL(/\/orders$/);

    // доходим до формы новой работы и отправляем ее пустой - одним вызовом фасада
    await app.shop.submitEmptyForm();

    // под каждым пустым полем - своя ошибка (локаторы формы)
    await expect(app.newWorkPage.titleError).toBeVisible();
    await expect(app.newWorkPage.workTypeError).toBeVisible();
    await expect(app.newWorkPage.subjectError).toBeVisible();
    await expect(app.newWorkPage.descriptionError).toBeVisible();

    // информер про обязательный файл
    await expect(app.newWorkPage.filesRequiredAlert).toBeVisible();
  },
);
