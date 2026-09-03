// Facade "Добавить работу в магазин" (Магазин готовых работ).
// Предусловие: пользователь авторизован (studwork.json).

import { HeaderMenu, ShopPage, NewWorkPage } from "../pages/index.js";

export class AddShopWorkFacade {
  constructor(page) {
    this.page = page;
    this.menu = new HeaderMenu(page);
    this.shopPage = new ShopPage(page);
    this.newWorkPage = new NewWorkPage(page);
  }

  //под-шаг: дойти до открытой формы новой работы
  async #openNewWorkForm() {
    await this.menu.openShop();
    await this.shopPage.clickAddWork();
    // ждем заголовок "Новая готовая работа"
    await this.newWorkPage.heading.waitFor({ state: "visible" });
  }

  // ВАРИАНТ ПОЗИТИВА с проверкой ДО отправки:
  // тесту нужно проверить, что файл прикрепился и цена проставилась
  async fillWorkForm(work) {
    await this.#openNewWorkForm();
    await this.newWorkPage.fillForm(work);
  }

  // отправить заполненную форму (парой к fillWorkForm, когда нужна проверка до сабмита)
  async submit() {
    await this.newWorkPage.clickSubmit();
  }

  // НЕГАТИВ: дойти до формы и отправить ее пустой -> появятся ошибки валидации.
  async submitEmptyForm() {
    await this.#openNewWorkForm();
    await this.newWorkPage.clickSubmit();
  }
}
