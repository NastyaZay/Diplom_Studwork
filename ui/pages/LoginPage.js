// Страница входа studwork (/login).

export class LoginPage {
  constructor(page) {
    this.page = page;

    this.loginInput = page.getByPlaceholder("Логин или email");
    this.passwordInput = page.getByPlaceholder("Пароль");
    this.submitButton = page.getByRole("button", { name: "Войти" });

    // кнопка баннера куки (может перекрывать "Войти")
    this.acceptCookiesButton = page.getByRole("button", { name: "Хорошо" });

    this.serverError = page.getByText(
      "Пользователь с указанным именем и паролем не найден",
    );
  }

  async open() {
    await this.page.goto("/login");
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
}
