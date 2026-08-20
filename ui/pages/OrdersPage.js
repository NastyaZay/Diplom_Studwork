// Страница "Заказы" (/orders). Точка входа для UI-тестов финансов, магазина и квалификации.

export class OrdersPage {
  constructor(page) {
    this.page = page;
  }

  // открываем страницу заказов
  async open() {
    await this.page.goto("/orders");
  }
}
