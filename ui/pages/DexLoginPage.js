// Форма входа Dex (email/пароль/Login).

export class DexLoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.getByPlaceholder("email address");
    this.passwordInput = page.getByPlaceholder("password");
    this.loginButton = page.getByRole("button", { name: "Login" });
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
