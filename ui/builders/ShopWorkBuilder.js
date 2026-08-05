// Builder данных формы "Новая готовая работа".

import { fakerRU as faker } from "@faker-js/faker";

// Реальные значения выпадающих списков формы (дословно, как на сайте).
// Из них билдер берет случайное значение через faker - тест каждый раз
// проверяет разные варианты, а не один захардкоженный.
const WORK_TYPES = [
  "Задача",
  "Контрольная работа",
  "Курсовая работа",
  "Лабораторная работа",
  "Дипломная работа",
  "Реферат",
  "Отчет по практике",
  "Тест",
  "Чертеж",
  "Сочинение",
  "Эссе",
  "Перевод",
  "Диссертация",
  "Бизнес-план",
  "Презентация",
  "Ответы на билеты",
  "Статья",
  "Доклад",
  "Онлайн-помощь",
  "Рецензия",
  "Монография",
  "ВКР",
  "РГР",
  "Маркетинговое исследование",
  "Автореферат",
  "Аннотация",
  "НИР",
  "Докторская диссертация",
  "Магистерская диссертация",
  "Кандидатская диссертация",
  "ВАК",
  "Scopus",
  "РИНЦ",
  "Шпаргалка",
  "Дистанционная задача",
  "Творческая работа",
];

// Небольшой набор предметов, точно присутствующих в списке формы.
// Однословные и без риска частичного совпадения.
const SUBJECTS = [
  "Алгебра",
  "Геометрия",
  "Информатика",
  "Экономика",
  "Философия",
];

// минимальный настоящий JPEG, до 2 МБ
function buildJpegBuffer() {
  const header = Buffer.from([
    0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01,
    0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00,
  ]);
  const body = Buffer.alloc(50 * 1024, 0x00);
  const eoi = Buffer.from([0xff, 0xd9]);
  return Buffer.concat([header, body, eoi]);
}

export class ShopWorkBuilder {
  constructor() {
    this.work = {
      title: undefined,
      description: undefined,
      price: undefined,
      workType: undefined,
      subject: undefined,
      file: undefined,
    };
  }

  // заголовок 10-250 символов
  withValidTitle() {
    let title = faker.lorem.words(15).slice(0, 120).trim();
    while (title.length < 10) {
      title = `${title} ${faker.lorem.words(3)}`.trim();
    }
    this.work.title = title;
    return this;
  }

  // описание 25-3000 символов
  withValidDescription() {
    let description = faker.lorem.words(60).slice(0, 500).trim();
    while (description.length < 25) {
      description = `${description} ${faker.lorem.words(10)}`.trim();
    }
    this.work.description = description;
    return this;
  }

  withValidPrice() {
    this.work.price = faker.number.int({ min: 100, max: 99999 });
    return this;
  }

  // тип работы из реального списка. По умолчанию - случайный.
  withWorkType(workType = faker.helpers.arrayElement(WORK_TYPES)) {
    this.work.workType = workType;
    return this;
  }

  // предмет из реального списка. По умолчанию - случайный.
  withSubject(subject = faker.helpers.arrayElement(SUBJECTS)) {
    this.work.subject = subject;
    return this;
  }

  // валидный jpg в памяти. displayName - имя без расширения
  withGeneratedFile() {
    const baseName = faker.lorem.word();
    this.work.file = {
      name: `${baseName}.jpg`,
      displayName: baseName,
      mimeType: "image/jpeg",
      buffer: buildJpegBuffer(),
    };
    return this;
  }

  withValidWork() {
    return this.withValidTitle()
      .withValidDescription()
      .withValidPrice()
      .withWorkType()
      .withSubject()
      .withGeneratedFile();
  }

  build() {
    if (
      !this.work.title ||
      !this.work.description ||
      !this.work.price ||
      !this.work.workType ||
      !this.work.subject ||
      !this.work.file
    ) {
      throw new Error(
        "Данные работы заполнены не полностью. Используй withValidWork() перед build().",
      );
    }
    return this.work;
  }
}
