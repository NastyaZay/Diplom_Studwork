// Форма "Новая готовая работа" (/info/shop/new).

export class NewWorkPage {
  constructor(page) {
    this.page = page;

    this.heading = page.getByRole("heading", { name: "Новая готовая работа" });
    this.submitButton = page.getByRole("button", { name: "Добавить работу" });

    // поля формы
    this.titleInput = page.getByPlaceholder("Заголовок работы");
    this.workTypeSelectInput = page.getByPlaceholder("Тип работы");
    this.subjectSelectInput = page.getByPlaceholder(
      "Введите название предмета",
    );

    // описание - редактор Quill, нужный из нескольких уточняем по data-placeholder
    this.descriptionEditor = page.locator(
      '.ql-editor[data-placeholder="Подробно опишите вашу работу"]',
    );

    // input[type=file] именно для файлов работы (внутри label "Загрузить файлы работы")
    this.fileInput = page
      .locator("label", { hasText: "Загрузить файлы работы" })
      .locator('input[type="file"]');

    // цена: кнопка "0 ₽" раскрывает поле ввода суммы
    this.priceButton = page.locator(".input-price__button button");
    this.priceInput = page.locator("input.currency-input");

    // ошибки валидации (негатив)
    this.titleError = page.getByText("Укажите заголовок работы");
    this.workTypeError = page.getByText("Укажите тип работы");
    this.subjectError = page.getByText("Укажите предмет");
    this.descriptionError = page.getByText("Заполните описание");
    this.filesRequiredAlert = page.getByText(
      "Для сохранения необходимо загрузить хотя бы один файл готовой работы.",
    );

    this.successToast = page.getByText("Готовая работа добавлена");
  }

  async open() {
    await this.page.goto("/info/shop/new");
  }

  async clickSubmit() {
    await this.submitButton.waitFor({ state: "visible" });
    await this.submitButton.click();
  }

  async fillTitle(title) {
    await this.titleInput.fill(title);
  }

  // выбрать тип работы из выпадающего списка (видимый пункт с нужным текстом)
  async selectWorkType(typeName) {
    await this.workTypeSelectInput.click();
    const option = this.page
      .locator(".dropdown-item", { hasText: typeName })
      .filter({ visible: true });
    await option.first().waitFor({ state: "visible" });
    await option.first().click();
  }

  // выбрать предмет по точному тексту
  async selectSubject(subjectName) {
    await this.subjectSelectInput.click();
    const option = this.page
      .locator(".dropdown-item", {
        has: this.page.getByText(subjectName, { exact: true }),
      })
      .filter({ visible: true });
    await option.first().waitFor({ state: "visible" });
    await option.first().click();
  }

  async fillDescription(description) {
    await this.descriptionEditor.fill(description);
  }

  // загрузить файл из памяти (name/mimeType/buffer)
  async uploadFile(file) {
    await this.fileInput.setInputFiles({
      name: file.name,
      mimeType: file.mimeType,
      buffer: file.buffer,
    });
  }

  // цена: раскрыть поле -> ввести сумму посимвольно -> зафиксировать через blur.
  // pressSequentially шлет события на каждый символ, иначе Vue-модель не обновляется.
  async setPrice(price) {
    await this.priceButton.waitFor({ state: "visible" });
    await this.priceButton.click();
    await this.priceInput.waitFor({ state: "visible" });
    await this.priceInput.fill("");
    await this.priceInput.pressSequentially(String(price));
    await this.priceInput.blur();
  }

  // --- локаторы для проверок в тесте ---

  //  Проверяем видимость блока загруженного файла
  get uploadedFileName() {
    return this.page.locator(".shop-files__file").filter({ visible: true });
  }

  // сумма на кнопке цены. Сайт форматирует число разрядами (обычный или неразрывный
  // пробел) + знак валюты, поэтому собираем regex из цифр с допуском пробела между ними.
  priceButtonWithAmount(price) {
    const digits = String(price).split("");
    const pattern = new RegExp(digits.join("\\s?"));
    return this.priceButton.filter({ hasText: pattern });
  }

  // заголовок работы на итоговой странице (берем по роли heading, чтобы не поймать
  // такой же текст в хлебных крошках)
  resultHeading(title) {
    return this.page.getByRole("heading", { name: title });
  }

  get moderationAlert() {
    return this.page.getByText(
      "не проверена модератором и не видна пользователям",
    );
  }
}
