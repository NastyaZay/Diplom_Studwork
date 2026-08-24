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

  // --- ГЕТТЕРЫ для проверок в тесте ---

  // карточка загруженного файла (проверка до сабмита)
  get uploadedFileName() {
    return this.newWorkPage.uploadedFileName;
  }

  // кнопка цены с нужной суммой (проверка до сабмита)
  priceButtonWithAmount(price) {
    return this.newWorkPage.priceButtonWithAmount(price);
  }

  // тост успеха после сохранения
  get successToast() {
    return this.newWorkPage.successToast;
  }

  // заголовок работы на итоговой странице
  resultHeading(title) {
    return this.newWorkPage.resultHeading(title);
  }

  // информер про модерацию на итоговой странице
  get moderationAlert() {
    return this.newWorkPage.moderationAlert;
  }

  // тип работы на итоговой странице
  resultWorkType(workType) {
    return this.newWorkPage.resultWorkType(workType);
  }

  // предмет на итоговой странице
  resultSubject(subject) {
    return this.newWorkPage.resultSubject(subject);
  }

  // маркер описания на итоговой странице
  descriptionMarker(marker) {
    return this.newWorkPage.descriptionMarker(marker);
  }

  // --- ГЕТТЕРЫ ошибок валидации (негатив) ---
  get titleError() {
    return this.newWorkPage.titleError;
  }
  get workTypeError() {
    return this.newWorkPage.workTypeError;
  }
  get subjectError() {
    return this.newWorkPage.subjectError;
  }
  get descriptionError() {
    return this.newWorkPage.descriptionError;
  }
  get filesRequiredAlert() {
    return this.newWorkPage.filesRequiredAlert;
  }
}
