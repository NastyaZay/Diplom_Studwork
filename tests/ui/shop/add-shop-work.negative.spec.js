// UI-тест (негатив): пустая форма новой работы -> ошибки валидации.
// Стартует залогиненным (studwork.json).

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

    // под каждым пустым полем - своя ошибка (геттеры фасада)
    await expect(app.shop.titleError).toBeVisible();
    await expect(app.shop.workTypeError).toBeVisible();
    await expect(app.shop.subjectError).toBeVisible();
    await expect(app.shop.descriptionError).toBeVisible();

    // информер про обязательный файл
    await expect(app.shop.filesRequiredAlert).toBeVisible();
  },
);
