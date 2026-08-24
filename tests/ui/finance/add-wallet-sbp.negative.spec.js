// UI-тест (негатив): счет СБП с коротким номером -> ошибка "Неверный номер телефона".
// Стартует залогиненным (studwork.json).

import { test, expect } from "../../../src/fixtures/index.js";
import { WalletBuilder } from "../../../src/ui/builders/index.js";

test(
  "Добавление счета СБП: короткий номер телефона показывает ошибку",
  {
    // теги для фильтрации запуска: @ui - все UI-тесты, @finance - домен финансов
    tag: ["@ui", "@finance"],
  },
  async ({ page, app }) => {
    // готовим данные: тип СБП + короткий номер (faker внутри билдера)
    const wallet = new WalletBuilder().withSbpShortPhone().build();

    // стартуем со страницы заказов (точка входа залогиненного пользователя)
    await app.ordersPage.open();
    await expect(page).toHaveURL(/\/orders$/);

    // доходим до формы, вводим короткий номер и отправляем (без подтверждения) -
    // весь путь одним вызовом фасада
    await app.wallet.submitWalletForm({
      type: wallet.type,
      phone: wallet.phone,
    });

    // под полем телефона - ошибка "Неверный номер телефона" (геттер фасада)
    await expect(app.wallet.phoneError).toBeVisible();
  },
);
