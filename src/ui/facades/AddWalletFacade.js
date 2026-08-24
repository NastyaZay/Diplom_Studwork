// Facade "Добавить платежный счет СБП" (страница Финансы).
// Предусловие: пользователь уже авторизован (стартовая сессия studwork.json).

import {
  HeaderMenu,
  FinancePage,
  AddWalletModal,
  ConfirmWalletModal,
} from "../pages/index.js";

export class AddWalletFacade {
  constructor(page) {
    this.page = page;
    this.menu = new HeaderMenu(page);
    this.financePage = new FinancePage(page);
    this.walletModal = new AddWalletModal(page);
    this.confirmModal = new ConfirmWalletModal(page);
  }

  // Дойти до открытой формы добавления счета
  async #openWalletForm() {
    await this.menu.openFinance();
    await this.financePage.openWalletsTab();
    await this.financePage.clickAddWallet();
    // ждем, что модалка реально открылась,
    await this.walletModal.heading.waitFor({ state: "visible" });
  }

  // ПОЗИТИВ: весь путь добавления счета с подтверждением кодом - одним методом.
  // Тест зовет одну строку и НЕ знает про перехват кода из консоли и 2FA-модалку.
  async addWalletWithConfirmation({ type, phone }) {
    await this.#openWalletForm();
    await this.walletModal.fillForm({ type, phone });

    // подсистема 2FA спрятана здесь: жмем "Добавить счет", ловим код из консоли,
    // затем вводим его. Тест про это ничего не знает.
    const code = await this.confirmModal.captureConfirmCode(async () => {
      await this.walletModal.clickSubmit();
    });
    await this.confirmModal.fillCode(code);
  }

  // НЕГАТИВ: доходим до формы, вводим невалидный номер, отправляем - БЕЗ подтверждения.
  async submitWalletForm({ type, phone }) {
    await this.#openWalletForm();
    await this.walletModal.fillForm({ type, phone });
    await this.walletModal.clickSubmit();
  }

  // --- ГЕТТЕРЫ для проверок в тесте (возвращают локаторы, но НЕ делают expect) ---

  // добавленный счет в списке по номеру телефона (для позитивной проверки)
  addedWallet(phone) {
    return this.financePage.addedWalletByPhone(phone);
  }

  // тост "Счет добавлен" (для позитивной проверки успеха)
  get successToast() {
    return this.confirmModal.successToast;
  }

  // ошибка под полем телефона (для негативной проверки)
  get phoneError() {
    return this.walletModal.phoneError;
  }
}
