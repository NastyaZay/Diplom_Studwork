// Главная страница. Нужна для шага "нажать Авторизация".

export class HomePage {
  constructor(page) {
    this.page = page;
    this.authLink = page.getByRole("link", { name: "Авторизация" });
  }

  async open() {
    await this.page.goto("/");
  }

  async clickAuth() {
    await this.authLink.click();
  }
}
