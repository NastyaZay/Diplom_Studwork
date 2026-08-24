// Экран согласия Dex (кнопка "Grant Access").

export class GrantAccessPage {
  constructor(page) {
    this.page = page;
    this.grantAccessButton = page.getByRole("button", { name: "Grant Access" });
  }

  async grantAccess() {
    await this.grantAccessButton.click();
  }
}
