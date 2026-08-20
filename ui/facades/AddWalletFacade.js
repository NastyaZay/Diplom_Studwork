// Facade "добавить платежный счет" (страница Финансы). Предусловие: авторизован.
// Шаги разбиты по бизнес-этапам, между которыми тест делает проверки.

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

  // шаг 1: Финансы через меню шапки
  async openFinanceFromOrders() {
    await this.menu.openFinance();
  }

  // шаг 2: таб "Платежные счета"
  async openWalletsTab() {
    await this.financePage.openWalletsTab();
  }

  // шаг 3: открыть модалку добавления счета
  async openAddWalletModal() {
    await this.financePage.clickAddWallet();
  }

  // шаг 4: заполнить форму счета (выбрать тип + ввести телефон) — все в одной модалке
  async fillWalletForm({ type, phone }) {
    await this.walletModal.openTypeDropdown();
    await this.walletModal.selectType(type);
    await this.walletModal.fillPhone(phone);
  }

  // шаг 5 (негатив): сабмит без перехвата кода
  async submitWallet() {
    await this.walletModal.clickSubmit();
  }

  // шаг 6 (позитив): сабмит + перехват кода из консоли
  async submitAndCaptureCode() {
    return this.confirmModal.captureConfirmCode(async () => {
      await this.walletModal.clickSubmit();
    });
  }

  // шаг 7 (позитив): ввести код подтверждения
  async enterConfirmCode(code) {
    await this.confirmModal.fillCode(code);
  }
}
