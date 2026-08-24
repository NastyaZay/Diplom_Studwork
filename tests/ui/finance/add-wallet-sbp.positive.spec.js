// UI-тест (позитив): счет СБП с валидным номером -> подтверждение кодом -> "Счет добавлен".
// Стартует залогиненным (studwork.json).

import { test, expect } from "../../../src/fixtures/index.js";
import { WalletBuilder } from "../../../src/ui/builders/index.js";

test(
  "Добавление счета СБП: валидный номер, подтверждение кодом, счет добавлен",
  {
    // теги для фильтрации запуска: @ui - все UI-тесты, @finance - домен финансов
    tag: ["@ui", "@finance"],
  },
  async ({ page, app }) => {
    // готовим данные: тип СБП + валидный номер (faker внутри билдера)
    const wallet = new WalletBuilder().withSbpValidPhone().build();

    // стартуем со страницы заказов (точка входа залогиненного пользователя)
    await app.ordersPage.open();
    await expect(page).toHaveURL(/\/orders$/);

    // весь путь добавления счета одним вызовом фасада:
    // меню -> Финансы -> таб счетов -> модалка -> заполнить -> подтвердить кодом
    await app.wallet.addWalletWithConfirmation({
      type: wallet.type,
      phone: wallet.phone,
    });

    // тост "Счет добавлен" (проверка итога через геттер фасада)
    await expect(app.wallet.successToast).toBeVisible();

    // добавленный счет появился в списке (проверка итога через геттер фасада)
    await expect(app.wallet.addedWallet(wallet.phone)).toBeVisible();
  },
);
