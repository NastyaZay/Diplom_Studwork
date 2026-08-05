// Facade "регистрация нового пользователя". Предусловие: гость.

import {
  SignUpPage,
  RegistrationConfirmModal,
  ProfileActivatedPage,
} from "../pages/index.js";

export class RegistrationFacade {
  constructor(page) {
    this.page = page;
    this.signUpPage = new SignUpPage(page);
    this.confirmModal = new RegistrationConfirmModal(page);
    this.profilePage = new ProfileActivatedPage(page);
  }

  // шаг 1: главная -> страница входа через "Авторизацию"
  async openAuthFromHome() {
    await this.signUpPage.openHome();
    await this.signUpPage.openAuth();
  }

  // шаг 2: таб "Регистрация"
  async openRegistrationTab() {
    await this.signUpPage.openRegistrationTab();
  }

  // шаг 3: email, пароль, чекбокс согласия
  async fillRegistrationForm(user) {
    await this.signUpPage.fillEmail(user.email);
    await this.signUpPage.fillPassword(user.password);
    await this.signUpPage.acceptConsent();
  }

  // шаг 4: сабмит + перехват кода из консоли
  async submitAndCaptureCode() {
    return this.confirmModal.captureConfirmCode(async () => {
      await this.signUpPage.clickRegistration();
    });
  }

  // шаг 5: ввести код подтверждения
  async enterConfirmCode(code) {
    await this.confirmModal.fillCode(code);
  }
}
