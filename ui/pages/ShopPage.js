// Магазин готовых работ (/shop).

export class ShopPage {
  constructor(page) {
    this.page = page;

    this.heading = page.getByRole("heading", { name: "Магазин готовых работ" });

    // зеленый круглый плюс (иконка без текста) -> форма новой работы, по href+классу
    this.addWorkButton = page.locator(
      'a[href="/info/shop/new"].shop__button_circle',
    );
  }

  async open() {
    await this.page.goto("/shop");
  }

  async clickAddWork() {
    await this.addWorkButton.waitFor({ state: "visible" });
    await this.addWorkButton.click();
  }
}
