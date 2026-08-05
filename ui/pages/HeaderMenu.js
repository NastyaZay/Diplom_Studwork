// Компонент шапки/бокового меню (навигация). Переиспользуется на разных страницах.

export class HeaderMenu {
  constructor(page) {
    this.page = page;

    this.shopLink = page.getByRole("link", { name: "Магазин", exact: true });
    this.ordersLink = page.getByRole("link", { name: "Заказы", exact: true });
    this.financeLink = page.getByRole("link", { name: "Финансы", exact: true });
    // пункт бокового меню профиля "Специализации" -> /info/specialization
    this.specializationLink = page.getByRole("link", {
      name: "Специализации",
      exact: true,
    });
  }

  async openShop() {
    await this.shopLink.click();
  }

  async openOrders() {
    await this.ordersLink.click();
  }

  async openFinance() {
    await this.financeLink.click();
  }

  async openSpecialization() {
    await this.specializationLink.click();
  }
}
