// Страница входа/регистрации (/login с табами "Вход" и "Регистрация").

export class SignUpPage {
  constructor(page) {
    this.page = page;

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

    // чекбокс согласия: кликабельная область - label (реальный input внутри
    // скрыт под текстом, поэтому кликаем именно по label, а не по input).
    this.consentCheckbox = page.locator("label.consent-checkbox");

    // кнопка "Регистрация" (button, роль отличает ее от таба-ссылки)
    this.registrationButton = page.getByRole("button", {
      name: "Регистрация",
    });

    // кнопка баннера куки. Баннер висит снизу и перекрывает нижнюю часть формы
    // (пароль, чекбокс, кнопку), из-за чего клики уходят в баннер, а не в форму.
    this.acceptCookiesButton = page.getByRole("button", { name: "Хорошо" });
  }
  async openRegistrationTab() {
    await this.registrationTab.click();
  }

  // Закрыть баннер куки, если он появился. Короткое ожидание, без waitForTimeout:
  // если баннера нет - спокойно продолжаем (тот же прием, что в LoginPage).
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

  async fillEmail(email) {
    await this.emailInput.fill(email);
  }

  // fill + blur: увод фокуса заставляет Vue зафиксировать значение
  // (поле валидируется на blur). Без этого клик "Регистрация" может уйти
  // раньше, чем модель сохранит пароль - форма отправится с пустым полем.
  async fillPassword(password) {
    await this.passwordInput.fill(password);
    await this.passwordInput.blur();
  }

  async acceptConsent() {
    await this.consentCheckbox.click();
  }

  // заполнить форму регистрации: сначала убираем баннер куки (иначе он
  // перекрывает поля и клики уходят в него), затем email, пароль, согласие.
  async fillRegistrationForm(user) {
    await this.acceptCookies();
    await this.fillEmail(user.email);
    await this.fillPassword(user.password);
    await this.acceptConsent();
  }

  async clickRegistration() {
    await this.registrationButton.waitFor({ state: "visible" });
    await this.registrationButton.click();
  }
}
