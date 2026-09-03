// импортируем фасады напрямую из файлов (не через ./index.js), чтобы избежать
// циклической зависимости: index.js сам экспортирует StudworkApp.

import { AddWalletFacade } from "./AddWalletFacade.js";
import { AddShopWorkFacade } from "./AddShopWorkFacade.js";
import {
  OrdersPage,
  HomePage,
  HeaderMenu,
  SpecializationPage,
  QualificationPage,
  NewWorkPage,
  SignUpPage,
  RegistrationConfirmModal,
  ProfileActivatedPage,
  LoginPage,
  ProxyPage,
} from "../pages/index.js";

export class StudworkApp {
  constructor(page) {
    this.page = page;

    // фасады остаются только там, где есть подсистема, которую они скрывают
    this.wallet = new AddWalletFacade(page); // платежные счета (финансы) - прячет 2FA
    this.shop = new AddShopWorkFacade(page); // добавление работы в магазин - прячет навигацию до формы

    this.newWorkPage = new NewWorkPage(page); // форма /info/shop/new
    this.headerMenu = new HeaderMenu(page); // боковое меню (переход в "Специализации")
    this.specializationPage = new SpecializationPage(page); // страница /info/specialization
    this.qualificationPage = new QualificationPage(page); // форма /info/specialization/qualification
    this.signUpPage = new SignUpPage(page); // форма входа/регистрации (/login)
    this.confirmModal = new RegistrationConfirmModal(page); // модалка подтверждения кодом
    this.profilePage = new ProfileActivatedPage(page); // /info - профиль активирован
    this.loginPage = new LoginPage(page); // форма входа (/login)
    this.proxyPage = new ProxyPage(page); // экран OAuth2 Proxy (кнопка "Sign in with Dex")

    // Точки входа
    this.ordersPage = new OrdersPage(page); // /orders - старт залогиненных сценариев
    this.homePage = new HomePage(page); // / - главная (тест проверки доступа)
  }
}
