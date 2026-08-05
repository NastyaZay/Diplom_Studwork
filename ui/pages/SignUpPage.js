// Страница входа/регистрации (/login с табами "Вход" и "Регистрация").

export class SignUpPage {
  constructor(page) {
    this.page = page;

    // ссылка "Авторизация" в шапке гостя -> /login
    this.authLink = page.getByRole("link", { name: "Авторизация" });

    // заголовки (h1), берем по роли heading
    this.loginHeading = page.getByRole("heading", { name: "Вход" });
    this.registrationHeading = page.getByRole("heading", {
      name: "Регистрация",
    });

    // таб "Регистрация" - это ссылка a.sf-tab (на странице есть вторая ссылка с тем же текстом, поэтому берем именно таб через класс)
    this.registrationTab = page
      .locator("a.sf-tab")
      .filter({ hasText: "Регистрация" });

    this.emailInput = page.getByPlaceholder("E-mail");
    this.passwordInput = page.getByPlaceholder("Пароль");

    // чекбокс согласия: кликабельная область - label
    this.consentCheckbox = page.locator("label.consent-checkbox");

    // кнопка-сабмит "Регистрация" (button, роль отличает ее от таба-ссылки)
    this.registrationButton = page.getByRole("button", {
      name: "Регистрация",
    });
  }

  async openHome() {
    await this.page.goto("/");
  }

  async openAuth() {
    await this.authLink.click();
  }

  async openRegistrationTab() {
    await this.registrationTab.click();
  }

  // .blur() после fill - чтобы форма зафиксировала значение (событие change/blur)
  async fillEmail(email) {
    await this.emailInput.fill(email);
    await this.emailInput.blur();
  }

  async fillPassword(password) {
    await this.passwordInput.fill(password);
    await this.passwordInput.blur();
  }

  async acceptConsent() {
    await this.consentCheckbox.click();
  }

  async clickRegistration() {
    await this.registrationButton.waitFor({ state: "visible" });
    await this.registrationButton.click();
  }
}
