// Facade "Вход в studwork"
import { HomePage, LoginPage } from "../pages/index.js";

export class LoginFacade {
  constructor(page) {
    this.page = page;
    // подсистема входа: две страницы, тест про них знать не будет
    this.homePage = new HomePage(page);
    this.loginPage = new LoginPage(page);
  }

  // ЕДИНЫЙ бизнес-сценарий: весь вход с главной страницы одним методом.
  // Главная -> Авторизация -> куки -> логин -> пароль -> Войти.
  async loginFromHomePage({ login, password }) {
    // открываем главную и идем к форме входа
    await this.homePage.open();
    await this.homePage.clickAuth();
    // сам вход (метод signIn уже объединяет куки + логин + пароль + сабмит)
    await this.loginPage.signIn({ login, password });
  }
}
