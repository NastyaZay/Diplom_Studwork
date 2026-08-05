// Страница "Финансы" (/finance).

export class FinancePage {
  constructor(page) {
    this.page = page;

    this.heading = page.getByRole("heading", { name: "Баланс" });

    // таб-ссылка "Платежные счета"
    this.walletsTab = page.getByRole("link", { name: "Платёжные счета" });

    // кнопка открытия модалки добавления счета
    this.addWalletButton = page.getByRole("button", { name: "Добавить счёт" });

    // номера добавленных счетов (span.wallet__account, например "7 996 346 25 03")
    this.walletAccounts = page.locator("span.wallet__account");
  }

  // найти добавленный счет по телефону: на странице номер с пробелами и кодом страны,
  // в тест приходит 10 цифр, поэтому сравниваем только цифры в том же порядке
  addedWalletByPhone(phone) {
    const digitsPattern = phone.split("").join("\\D*");
    return this.walletAccounts.filter({
      hasText: new RegExp(digitsPattern),
    });
  }

  async open() {
    await this.page.goto("/finance");
  }

  async openWalletsTab() {
    await this.walletsTab.click();
  }

  async clickAddWallet() {
    await this.addWalletButton.waitFor({ state: "visible" });
    await this.addWalletButton.click();
  }
}
