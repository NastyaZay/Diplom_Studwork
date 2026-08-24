// Валидный номер - 10 цифр (после +7). Короткий (1-7 цифр) - для негатива.

import { fakerRU as faker } from "@faker-js/faker";

export class WalletBuilder {
  constructor() {
    this.wallet = { type: undefined, phone: undefined };
  }

  withType(type = "СБП") {
    this.wallet.type = type;
    return this;
  }

  // короткий (невалидный) номер: 1-7 цифр -> ждем ошибку валидации
  withShortPhone() {
    const length = faker.number.int({ min: 1, max: 7 });
    this.wallet.phone = faker.string.numeric(length);
    return this;
  }

  withSbpShortPhone() {
    return this.withType("СБП").withShortPhone();
  }

  // валидный номер: 10 цифр, первая 9 (формат 9XXXXXXXXX)
  withValidPhone() {
    this.wallet.phone = "9" + faker.string.numeric(9);
    return this;
  }

  withSbpValidPhone() {
    return this.withType("СБП").withValidPhone();
  }

  build() {
    if (!this.wallet.type || !this.wallet.phone) {
      throw new Error(
        "Данные счета заполнены не полностью. Используй билдер-метод перед build().",
      );
    }
    return { ...this.wallet };
  }
}
