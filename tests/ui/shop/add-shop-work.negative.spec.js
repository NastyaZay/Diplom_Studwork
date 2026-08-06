// UI-тест (негатив): пустая форма новой работы -> ошибки валидации.
// Стартует залогиненным (studwork.json).

import { test, expect } from "../../../fixtures/index.js";

test(
  "Добавление работы: пустая форма показывает ошибки валидации",
  {
    // теги для фильтрации запуска: @ui - все UI-тесты, @shop - домен магазина
    tag: ["@ui", "@shop"],
  },
  async ({ page, addShopWorkFacade }) => {
    // стартуем с заказов
    await page.goto("/orders");
    await expect(page).toHaveURL(/\/orders$/);

    // идем в Магазин и доходим до формы новой работы
    await addShopWorkFacade.openNewWorkForm();
    await page.waitForURL((url) => url.pathname === "/info/shop/new");

    // мы на форме "Новая готовая работа"
    await expect(addShopWorkFacade.newWorkPage.heading).toBeVisible();

    // отправляем пустую форму
    await addShopWorkFacade.submitEmptyForm();

    // под каждым пустым полем - своя ошибка
    await expect(addShopWorkFacade.newWorkPage.titleError).toBeVisible();
    await expect(addShopWorkFacade.newWorkPage.workTypeError).toBeVisible();
    await expect(addShopWorkFacade.newWorkPage.subjectError).toBeVisible();
    await expect(addShopWorkFacade.newWorkPage.descriptionError).toBeVisible();

    // информер про обязательный файл
    await expect(
      addShopWorkFacade.newWorkPage.filesRequiredAlert,
    ).toBeVisible();
  },
);
