// UI-тест (негатив): счет СБП с коротким номером -> ошибка "Неверный номер телефона".
// Стартует залогиненным (studwork.json).

import { test, expect } from "../../../fixtures/index.js";
import { WalletBuilder } from "../../../ui/builders/WalletBuilder.js";

test("Добавление счета СБП: короткий номер телефона показывает ошибку", async ({
  page,
  addWalletFacade,
}) => {
  // готовим данные: тип СБП + короткий номер (faker внутри билдера)
  const wallet = new WalletBuilder().withSbpShortPhone().build();

  // стартуем с заказов
  await page.goto("/orders");
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

  // выбираем тип СБП
  await addWalletFacade.chooseWalletType(wallet.type);

  // появилось поле телефона
  await expect(addWalletFacade.walletModal.phoneInput).toBeVisible();

  // вводим короткий номер
  await addWalletFacade.enterPhone(wallet.phone);

  // нажимаем "Добавить счет"
  await addWalletFacade.submitWallet();

  // под полем телефона - ошибка "Неверный номер телефона"
  await expect(addWalletFacade.walletModal.phoneError).toBeVisible();
});
