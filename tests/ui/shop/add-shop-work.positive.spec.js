// UI-тест (позитив): заполненная форма новой работы успешно сохраняется.
// Стартует залогиненным (studwork.json).

import { test, expect } from "../../../fixtures/index.js";
import { ShopWorkBuilder } from "../../../ui/builders/ShopWorkBuilder.js";

test(
  "Добавление работы: заполненная форма успешно сохраняется",
  {
    // теги для фильтрации запуска: @ui - все UI-тесты, @shop - домен магазина
    tag: ["@ui", "@shop"],
  },
  async ({ page, addShopWorkFacade }) => {
    // собираем валидные данные работы
    const work = new ShopWorkBuilder().withValidWork().build();

    // стартуем с заказов
    await page.goto("/orders");
    await expect(page).toHaveURL(/\/orders$/);

    // идем в Магазин и доходим до формы
    await addShopWorkFacade.openNewWorkForm();
    await page.waitForURL((url) => url.pathname === "/info/shop/new");
    await expect(addShopWorkFacade.newWorkPage.heading).toBeVisible();

    // заполняем всю форму одним вызовом фасада
    await addShopWorkFacade.fillWorkForm(work);

    // проверяем, что карточка загруженного файла отобразилась, и сумму на кнопке цены
    await expect(addShopWorkFacade.newWorkPage.uploadedFileName).toBeVisible();
    await expect(
      addShopWorkFacade.newWorkPage.priceButtonWithAmount(work.price),
    ).toBeVisible();

    // отправляем форму
    await addShopWorkFacade.submitWork();

    // тост, заголовок итоговой страницы, информер про модерацию
    await expect(addShopWorkFacade.newWorkPage.successToast).toBeVisible();
    await expect(
      addShopWorkFacade.newWorkPage.resultHeading(work.title),
    ).toBeVisible();
    await expect(addShopWorkFacade.newWorkPage.moderationAlert).toBeVisible();
  },
);
