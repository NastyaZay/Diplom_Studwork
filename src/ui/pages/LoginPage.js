// Страница входа studwork (/login).

export class LoginPage {
  constructor(page) {
    this.page = page;

    this.loginInput = page.getByPlaceholder("Логин или email");
    this.passwordInput = page.getByPlaceholder("Пароль");
    this.submitButton = page.getByRole("button", { name: "Войти" });

    // кнопка баннера куки (может перекрывать "Войти")
    this.acceptCookiesButton = page.getByRole("button", { name: "Хорошо" });
  }

  async fillLogin(login) {
    await this.loginInput.fill(login);
  }

  async fillPassword(password) {
    await this.passwordInput.fill(password);
  }

  // закрыть баннер куки, если появится (короткое ожидание, без waitForTimeout)
  async acceptCookies() {
    try {
      await this.acceptCookiesButton.waitFor({
        state: "visible",
        timeout: 3000,
      });
      await this.acceptCookiesButton.click();
    } catch {
      // баннер не появился - продолжаем
    }
  }

  async clickSubmit() {
    await this.submitButton.waitFor({ state: "visible" });
    await this.submitButton.click();
  }

  // вход: закрыть баннер куки -> логин -> пароль -> Войти.
  async signIn({ login, password }) {
    await this.acceptCookies();
    await this.fillLogin(login);
    await this.fillPassword(password);
    await this.clickSubmit();
  }
}
