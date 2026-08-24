// Builder данных формы квалификации.
// Лимиты формы: ФИО до 255 символов, ссылка до 50.

import { fakerRU as faker } from "@faker-js/faker";

export class QualificationBuilder {
  constructor() {
    this.data = { fio: undefined, link: undefined };
  }

  // ФИО "Фамилия Имя Отчество"
  withFio() {
    const lastName = faker.person.lastName("male");
    const firstName = faker.person.firstName("male");
    const middleName = faker.person.middleName("male");
    this.data.fio = `${lastName} ${firstName} ${middleName}`;
    return this;
  }

  // короткая валидная ссылка (до 50 символов).
  // Ссылку генерируем целиком через faker (домен + путь), без хардкода домена.
  // faker.internet.url() дает "https://домен", добавляем случайный сегмент пути.
  withLink() {
    const base = faker.internet.url({ appendSlash: true });
    const slug = faker.internet.username().toLowerCase();
    // склеиваем и обрезаем под лимит формы (50 символов)
    this.data.link = `${base}${slug}`.slice(0, 50);
    return this;
  }

  withValidData() {
    return this.withFio().withLink();
  }

  build() {
    if (!this.data.fio || !this.data.link) {
      throw new Error(
        "Данные квалификации заполнены не полностью. Используй withValidData() перед build().",
      );
    }
    if (this.data.fio.length > 255) {
      throw new Error("ФИО превышает лимит 255 символов.");
    }
    if (this.data.link.length > 50) {
      throw new Error("Ссылка превышает лимит 50 символов.");
    }
    return { ...this.data };
  }
}
