// Стартовая страница OAuth2 Proxy (кнопка "Sign in with Dex").

export class ProxyPage {
  constructor(page) {
    this.page = page;
    this.signInWithDexButton = page.getByRole("button", {
      name: "Sign in with Dex",
    });
  }

  async open(baseURL) {
    await this.page.goto(baseURL);
  }

  // показан ли экран Dex: ждем кнопку через встроенное ожидание, без waitForTimeout
  async isDexScreenVisible(timeout = 5000) {
    try {
      await this.signInWithDexButton.waitFor({ state: "visible", timeout });
      return true;
    } catch {
      return false;
    }
  }

  async clickSignInWithDex() {
    await this.signInWithDexButton.click();
  }
}
