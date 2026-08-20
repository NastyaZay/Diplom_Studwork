// UI-фикстуры фасадов. Каждая фикстура создает фасад через встроенный fixture `page`
// и отдает его в тест. В тестах фасады НЕ создаются вручную.

import { test as base } from "@playwright/test";
import { OrdersPage } from "../ui/pages/OrdersPage.js";
import { LoginFacade } from "../ui/facades/LoginFacade.js";
import { AddShopWorkFacade } from "../ui/facades/AddShopWorkFacade.js";
import { AddWalletFacade } from "../ui/facades/AddWalletFacade.js";
import { RegistrationFacade } from "../ui/facades/RegistrationFacade.js";
import { QualificationFacade } from "../ui/facades/QualificationFacade.js";
import { HomePage } from "../ui/pages/HomePage.js";

// base.extend добавляет наши фасады к встроенному test.
export const uiTest = base.extend({
  ordersPage: async ({ page }, use) => {
    await use(new OrdersPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  loginFacade: async ({ page }, use) => {
    await use(new LoginFacade(page));
  },
  addShopWorkFacade: async ({ page }, use) => {
    await use(new AddShopWorkFacade(page));
  },
  addWalletFacade: async ({ page }, use) => {
    await use(new AddWalletFacade(page));
  },
  registrationFacade: async ({ page }, use) => {
    await use(new RegistrationFacade(page));
  },
  qualificationFacade: async ({ page }, use) => {
    await use(new QualificationFacade(page));
  },
});
