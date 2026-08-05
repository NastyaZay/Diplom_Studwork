// Facade "войти в аккаунт studwork" (прикладной вход через форму).

import { HomePage, LoginPage } from "../pages/index.js";

export class LoginFacade {
  constructor(page) {
    this.page = page;
    this.homePage = new HomePage(page);
    this.loginPage = new LoginPage(page);
  }

  // весь вход с главной страницы одним бизнес-методом
  async loginFromHomePage({ login, password }) {
    await this.homePage.open();
    await this.homePage.clickAuth();
    await this.loginPage.acceptCookies();
    await this.loginPage.fillLogin(login);
    await this.loginPage.fillPassword(password);
    await this.loginPage.clickSubmit();
  }
}
