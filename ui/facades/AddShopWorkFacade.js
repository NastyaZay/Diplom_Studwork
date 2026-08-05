// Facade "добавить работу в магазин". Предусловие: пользователь авторизован.
// Шаги разбиты по бизнес-этапам, между которыми тест делает проверки.

import { HeaderMenu, ShopPage, NewWorkPage } from "../pages/index.js";

export class AddShopWorkFacade {
  constructor(page) {
    this.page = page;
    this.menu = new HeaderMenu(page);
    this.shopPage = new ShopPage(page);
    this.newWorkPage = new NewWorkPage(page);
  }

  // шаг 1: дойти до формы новой работы (Магазин через меню шапки -> зеленый плюс)
  async openNewWorkForm() {
    await this.menu.openShop();
    await this.shopPage.clickAddWork();
  }

  // шаг 2 (негатив): отправить пустую форму
  async submitEmptyForm() {
    await this.newWorkPage.clickSubmit();
  }

  // шаг (позитив): заполнить форму данными из билдера
  async fillWorkForm(work) {
    await this.newWorkPage.fillTitle(work.title);
    await this.newWorkPage.selectWorkType(work.workType);
    await this.newWorkPage.selectSubject(work.subject);
    await this.newWorkPage.fillDescription(work.description);
    await this.newWorkPage.uploadFile(work.file);
    await this.newWorkPage.setPrice(work.price);
  }

  // шаг (позитив): отправить заполненную форму
  async submitWork() {
    await this.newWorkPage.clickSubmit();
  }
}
