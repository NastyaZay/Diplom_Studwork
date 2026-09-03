// UI-тест (позитив): заполненная форма новой работы успешно сохраняется.
// Стартует залогиненным (studwork.json).
//
// Действия (путь до формы + заполнение) прячет фасад app.shop.
// Проверки тест берет из самой формы напрямую - app.newWorkPage.

import { test, expect } from "../../../src/fixtures/index.js";
import { ShopWorkBuilder } from "../../../src/ui/builders/index.js";

test(
  "Добавление работы: заполненная форма успешно сохраняется",
  {
    // теги для фильтрации запуска: @ui - все UI-тесты, @shop - домен магазина
    tag: ["@ui", "@shop"],
  },
  async ({ page, app }) => {
    // собираем валидные данные работы
    const work = new ShopWorkBuilder().withValidWork().build();

    // стартуем со страницы заказов (точка входа залогиненного пользователя)
    await app.ordersPage.open();
    await expect(page).toHaveURL(/\/orders$/);

    // доходим до формы и заполняем ее (БЕЗ сабмита), чтобы проверить
    // прикрепленный файл и цену ДО отправки - весь путь одним вызовом фасада
    await app.shop.fillWorkForm(work);

    // проверяем, что карточка файла отобразилась и сумма проставилась (локаторы формы)
    await expect(app.newWorkPage.uploadedFileName).toBeVisible();
    await expect(
      app.newWorkPage.priceButtonWithAmount(work.price),
    ).toBeVisible();

    // отправляем форму
    await app.shop.submit();

    // тост, заголовок итоговой страницы, информер про модерацию (локаторы формы)
    await expect(app.newWorkPage.successToast).toBeVisible();
    await expect(app.newWorkPage.resultHeading(work.title)).toBeVisible();
    await expect(app.newWorkPage.moderationAlert).toBeVisible();

    // выбранные тип, предмет и описание отобразились на итоговой странице
    await expect(
      app.newWorkPage.resultWorkType(work.workType).first(),
    ).toBeVisible();
    await expect(
      app.newWorkPage.resultSubject(work.subject).first(),
    ).toBeVisible();
    await expect(
      app.newWorkPage.descriptionMarker(work.description.split(".")[0]),
    ).toBeVisible();
  },
);
