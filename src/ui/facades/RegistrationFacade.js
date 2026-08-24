// Facade "Регистрация нового пользователя". Предусловие: гость (не залогинен).

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

  // КОНТРОЛЬНАЯ ТОЧКА 1: открыть страницу входа (главная -> Авторизация).
  // После нее на экране виден заголовок "Вход" - тест его проверяет ДО переключения таба.
  async openAuthPage() {
    await this.signUpPage.openHome();
    await this.signUpPage.openAuth();
  }

  // КОНТРОЛЬНАЯ ТОЧКА 2: переключиться на таб "Регистрация".
  // После нее виден заголовок "Регистрация"
  async openRegistrationTab() {
    await this.signUpPage.openRegistrationTab();
  }

  // КОНТРОЛЬНАЯ ТОЧКА 3: заполнить форму + отправить + перехватить код + ввести код.
  // Возвращает перехваченный код, чтобы тест проверил формат "ровно 5 цифр".
  // Подсистема 2FA (перехват из консоли) спрятана здесь - тест про нее не знает.
  async submitRegistration(user) {
    // заполняем форму: email, пароль, согласие
    await this.signUpPage.fillRegistrationForm(user);

    // жмем "Регистрация" и ловим код из консоли
    const code = await this.confirmModal.captureConfirmCode(async () => {
      await this.signUpPage.clickRegistration();
    });

    // вводим код подтверждения
    await this.confirmModal.fillCode(code);

    return code;
  }

  // --- ГЕТТЕРЫ для проверок в тесте ---

  // заголовок "Вход" (проверка, что открылась страница входа до переключения таба)
  get loginHeading() {
    return this.signUpPage.loginHeading;
  }

  // заголовок "Регистрация" (проверка, что таб регистрации активен)
  get registrationHeading() {
    return this.signUpPage.registrationHeading;
  }

  // заголовок модалки "Подтверждение регистрации"
  get confirmHeading() {
    return this.confirmModal.heading;
  }

  // почта, на которую отправлен код (проверяем, что показана введенная почта)
  get emailTarget() {
    return this.confirmModal.emailTarget;
  }

  // заголовок "Профиль активирован" (финальная проверка успеха)
  get profileHeading() {
    return this.profilePage.heading;
  }
}
