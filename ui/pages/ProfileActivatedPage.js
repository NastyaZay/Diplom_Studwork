// Страница профиля (/info) после подтверждения регистрации.

export class ProfileActivatedPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: "Профиль активирован" });
  }
}
