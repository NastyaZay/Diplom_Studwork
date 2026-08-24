// UI-тест (позитив): заполненная форма новой работы успешно сохраняется.
// Стартует залогиненным (studwork.json).

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

    // проверяем, что карточка файла отобразилась и сумма проставилась (геттеры фасада)
    await expect(app.shop.uploadedFileName).toBeVisible();
    await expect(app.shop.priceButtonWithAmount(work.price)).toBeVisible();

    // отправляем форму
    await app.shop.submit();

    // тост, заголовок итоговой страницы, информер про модерацию (геттеры фасада)
    await expect(app.shop.successToast).toBeVisible();
    await expect(app.shop.resultHeading(work.title)).toBeVisible();
    await expect(app.shop.moderationAlert).toBeVisible();

    // выбранные тип, предмет и описание отобразились на итоговой странице
    await expect(app.shop.resultWorkType(work.workType).first()).toBeVisible();
    await expect(app.shop.resultSubject(work.subject).first()).toBeVisible();
    await expect(
      app.shop.descriptionMarker(work.description.split(".")[0]),
    ).toBeVisible();
  },
);
