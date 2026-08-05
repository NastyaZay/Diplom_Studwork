// Модалка "Добавление счета" (страница Финансы).

export class AddWalletModal {
  constructor(page) {
    this.page = page;

    this.heading = page.getByText("Добавление счёта", { exact: true });

    // инпут выпадающего списка типов счета
    this.typeSelectInput = page.getByPlaceholder("Выбор типа платёжного счёта");

    // поле телефона (появляется после выбора СБП)
    this.phoneInput = page.getByPlaceholder("Номер телефона");

    // кнопка-сабмит внутри формы модалки (на странице есть вторая такая кнопка -
    // открывашка, поэтому ищем именно внутри form)
    this.submitButton = page
      .locator("form")
      .getByRole("button", { name: "Добавить счёт" });

    this.phoneError = page.getByText("Неверный номер телефона");
  }

  async openTypeDropdown() {
    await this.typeSelectInput.click();
  }

  // выбрать тип счета из списка по точному тексту (берем видимый пункт)
  async selectType(typeName) {
    const option = this.page
      .locator(".dropdown-item", {
        has: this.page.getByText(typeName, { exact: true }),
      })
      .filter({ visible: true });
    await option.first().waitFor({ state: "visible" });
    await option.first().click();
  }

  async fillPhone(phone) {
    await this.phoneInput.fill(phone);
  }

  async clickSubmit() {
    await this.submitButton.waitFor({ state: "visible" });
    await this.submitButton.click();
  }
}
