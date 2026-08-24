// импортируем фасады напрямую из файлов (не через ./index.js), чтобы избежать
// циклической зависимости: index.js сам экспортирует StudworkApp.
import { LoginFacade } from "./LoginFacade.js";
import { AddWalletFacade } from "./AddWalletFacade.js";
import { AddShopWorkFacade } from "./AddShopWorkFacade.js";
import { RegistrationFacade } from "./RegistrationFacade.js";
import { QualificationFacade } from "./QualificationFacade.js";
import { OrdersPage, HomePage } from "../pages/index.js";

export class StudworkApp {
  constructor(page) {
    this.page = page;

    // каждый фасад = один бизнес-домен приложения
    this.login = new LoginFacade(page); // вход в studwork
    this.registration = new RegistrationFacade(page); // регистрация нового пользователя
    this.wallet = new AddWalletFacade(page); // платежные счета (финансы)
    this.shop = new AddShopWorkFacade(page); // добавление работы в магазин
    this.qualification = new QualificationFacade(page); // подтверждение квалификации

    // Точки входа
    this.ordersPage = new OrdersPage(page); // /orders - старт залогиненных сценариев
    this.homePage = new HomePage(page); // / - главная (тест проверки доступа)
  }
}
