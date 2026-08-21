// UI-тест (позитив): счет СБП с валидным номером -> подтверждение кодом -> "Счет добавлен".
// Стартует залогиненным (studwork.json).

import { test, expect } from "../../../fixtures/index.js";
import { WalletBuilder } from "../../../ui/builders/index.js";

test(
  "Добавление счета СБП: валидный номер, подтверждение кодом, счет добавлен",
  {
    // теги для фильтрации запуска: @ui - все UI-тесты, @finance - домен финансов
    tag: ["@ui", "@finance"],
  },
  async ({ page, addWalletFacade, ordersPage }) => {
    // готовим данные: тип СБП + валидный номер (faker внутри билдера)
    const wallet = new WalletBuilder().withSbpValidPhone().build();

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

    // заполняем форму: выбираем тип СБП и вводим валидный номер
    await addWalletFacade.fillWalletForm({
      type: wallet.type,
      phone: wallet.phone,
    });

    // нажимаем "Добавить счет" и перехватываем код из консоли
    const code = await addWalletFacade.submitAndCaptureCode();

    // код должен состоять ровно из 5 цифр
    expect(code).toMatch(/^\d{5}$/);

    // открылась модалка подтверждения
    await expect(addWalletFacade.confirmModal.heading).toBeVisible();

    // вводим 5 цифр кода
    await addWalletFacade.enterConfirmCode(code);

    // тост "Счет добавлен"
    await expect(addWalletFacade.confirmModal.successToast).toBeVisible();

    // добавленный счет появился в списке
    await expect(
      addWalletFacade.financePage.addedWalletByPhone(wallet.phone),
    ).toBeVisible();
  },
);
