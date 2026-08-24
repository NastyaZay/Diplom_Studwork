import { fakerRU as faker } from "@faker-js/faker";

// Реальные disciplineId (предметы).
// Берем небольшой безопасный список проверенных id из разных групп предметов:
// сплошной диапазон 101-906 не подходит, внутри него есть дыры (несуществующие id).
const VALID_DISCIPLINE_IDS = [
  101, // Алгебра
  117, // Математический анализ
  278, // Физика
  289, // Химия
  404, // C/C++
  415, // Java
  416, // JavaScript
  435, // Python
  448, // Информатика
  523, // Психология
  552, // История
  629, // Маркетинг
  632, // Менеджмент
  665, // Экономика
  712, // Гражданское право
];

// Реальные workTypeId (типы работ): id идут от 1 до 36.
const VALID_WORK_TYPE_IDS = Array.from({ length: 36 }, (_, i) => i + 1);

export class PortfolioBuilder {
  constructor() {
    // Валидные значения по умолчанию (по кейсу):
    // title — от 10 до 255 символов, text — от 10 до 4000.

    this.portfolio = {
      title: faker.word.words({ count: { min: 3, max: 6 } }).padEnd(10, "а"),
      text: faker.lorem.sentences({ min: 2, max: 4 }).padEnd(10, "а"),
      fileIds: [], // превью: в тестах передаем пустой массив (отдельную ручку загрузки не трогаем)
      position: null,
      // disciplineId — предмет. Берем случайный id из списка ТОЧНО существующих.
      // arrayElement выбирает один элемент массива — так мы никогда не попадем в дыру.
      disciplineId: faker.helpers.arrayElement(VALID_DISCIPLINE_IDS),
      // workTypeId — тип работы. Тоже выбираем из справочника реальных id (1-36).
      workTypeId: faker.helpers.arrayElement(VALID_WORK_TYPE_IDS),
      price: null,
      isPremium: false,
    };
  }

  // задать заголовок вручную
  withTitle(title) {
    this.portfolio.title = title;
    return this;
  }

  // задать описание вручную
  withText(text) {
    this.portfolio.text = text;
    return this;
  }

  // задать массив id загруженных файлов (превью).
  // fileIds — обязательное поле, id приходит после загрузки файла отдельной ручкой.
  withFileIds(fileIds) {
    this.portfolio.fileIds = fileIds;
    return this;
  }

  // НЕГАТИВ: пустой заголовок (нарушает правило "от 10 символов")
  withEmptyTitle() {
    this.portfolio.title = "";
    return this;
  }

  // НЕГАТИВ: слишком короткий заголовок (меньше 10 символов)
  withTooShortTitle() {
    this.portfolio.title = "abc";
    return this;
  }

  // задать disciplineId (предмет)
  withDisciplineId(disciplineId) {
    this.portfolio.disciplineId = disciplineId;
    return this;
  }

  // задать workTypeId (тип работы)
  withWorkTypeId(workTypeId) {
    this.portfolio.workTypeId = workTypeId;
    return this;
  }

  // финальная сборка — отдаем копию объекта
  build() {
    return { ...this.portfolio };
  }
}
