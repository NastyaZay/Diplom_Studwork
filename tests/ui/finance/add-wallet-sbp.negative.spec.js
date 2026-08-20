// UI-тест (негатив): счет СБП с коротким номером -> ошибка "Неверный номер телефона".
// Стартует залогиненным (studwork.json).

import { test, expect } from "../../../fixtures/index.js";
import { WalletBuilder } from "../../../ui/builders/WalletBuilder.js";

test(
  "Добавление счета СБП: короткий номер телефона показывает ошибку",
  {
    // теги для фильтрации запуска: @ui - все UI-тесты, @finance - домен финансов
    tag: ["@ui", "@finance"],
  },
  async ({ page, addWalletFacade, ordersPage }) => {
    // готовим данные: тип СБП + короткий номер (faker внутри билдера)
    const wallet = new WalletBuilder().withSbpShortPhone().build();

    // стартуем с заказов
    await ordersPage.open();
    await expect(page).toHaveURL(/\/orders$/);

    // переходим в Финансы через меню шапки
    await addWalletFacade.openFinanceFromOrders();
    await page.waitForURL((url) => url.pathname === "/finance");

    // проверяем заголовок "Баланс"
    await expect(addWalletFacade.financePage.heading).toBeVisible();

    // переходим на таб "Платежные счета"
    await addWalletFacade.openWalletsTab();
    await expect(addWalletFacade.financePage.walletsTab).toHaveAttribute(
      "href",
      "/info/settings?tab=wallets",
    );

    // открываем модалку добавления счета
    await addWalletFacade.openAddWalletModal();
    await expect(addWalletFacade.walletModal.heading).toBeVisible();

    // заполняем форму: выбираем тип СБП и вводим короткий номер
    await addWalletFacade.fillWalletForm({
      type: wallet.type,
      phone: wallet.phone,
    });

    // нажимаем "Добавить счет"
    await addWalletFacade.submitWallet();

    // под полем телефона - ошибка "Неверный номер телефона"
    await expect(addWalletFacade.walletModal.phoneError).toBeVisible();
  },
);
