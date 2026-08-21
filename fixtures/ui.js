// UI-фикстуры фасадов. Каждая фикстура создает фасад через встроенный fixture `page`
// и отдает его в тест. В тестах фасады НЕ создаются вручную.

import { test as base } from "@playwright/test";
import { OrdersPage, HomePage } from "../ui/pages/index.js";
import {
  LoginFacade,
  AddShopWorkFacade,
  AddWalletFacade,
  RegistrationFacade,
  QualificationFacade,
} from "../ui/facades/index.js";

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
