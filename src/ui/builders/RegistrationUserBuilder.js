// Builder данных нового пользователя для регистрации.
// Email уникальный на каждый прогон. Пароль по правилам формы:
// 6-30 символов, минимум 1 заглавная, 1 строчная, 1 цифра.

import { fakerRU as faker } from "@faker-js/faker";

export class RegistrationUserBuilder {
  constructor() {
    this.user = { email: undefined, password: undefined };
  }

  withEmail() {
    this.user.email = faker.internet.email().toLowerCase();
    return this;
  }

  // собираем пароль
  withValidPassword() {
    const upper = faker.string.alpha({ length: 1, casing: "upper" });
    const lower = faker.string.alpha({ length: 1, casing: "lower" });
    const digit = faker.string.numeric(1);
    const rest = faker.string.alphanumeric(7);
    this.user.password = `${upper}${lower}${digit}${rest}`;
    return this;
  }

  withValidUser() {
    return this.withEmail().withValidPassword();
  }

  build() {
    if (!this.user.email || !this.user.password) {
      throw new Error(
        "Данные пользователя заполнены не полностью. Используй withValidUser() перед build().",
      );
    }
    return { ...this.user };
  }
}
