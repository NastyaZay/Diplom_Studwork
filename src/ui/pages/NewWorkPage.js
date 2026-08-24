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

  async clickSubmit() {
    await this.submitButton.waitFor({ state: "visible" });
    await this.submitButton.click();
  }

  async fillTitle(title) {
    await this.titleInput.fill(title);
  }

  // выбрать тип работы из выпадающего списка
  async selectWorkType(typeName) {
    await this.workTypeSelectInput.click();
    const option = this.page
      .locator(".dropdown-item", { hasText: typeName })
      .first();
    // подтягиваем пункт в зону видимости (ждет появления в DOM автоматически)
    await option.scrollIntoViewIfNeeded();
    await option.click();
  }

  // выбрать предмет по точному тексту
  async selectSubject(subjectName) {
    await this.subjectSelectInput.click();
    const option = this.page
      .locator(".dropdown-item", {
        has: this.page.getByText(subjectName, { exact: true }),
      })
      .first();
    await option.scrollIntoViewIfNeeded();
    await option.click();
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

  // заполнить всю форму новой работы из объекта билдера
  async fillForm(work) {
    await this.fillTitle(work.title);
    await this.selectWorkType(work.workType);
    await this.selectSubject(work.subject);
    await this.fillDescription(work.description);
    await this.uploadFile(work.file);
    await this.setPrice(work.price);
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

  // тип работы на итоговой странице (значение из билдера work.workType).
  // Значение выводится ссылкой, ищем по точному тексту через роль link.
  resultWorkType(workType) {
    return this.page.getByRole("link", { name: workType, exact: true });
  }

  // предмет на итоговой странице (значение из билдера work.subject).
  resultSubject(subject) {
    return this.page.getByRole("link", { name: subject, exact: true });
  }

  // маркер описания на итоговой странице (уникальная метка из билдера).
  // Ищем по видимому тексту - метка уникальна, поэтому надежно.
  descriptionMarker(marker) {
    return this.page.getByText(marker);
  }

  get moderationAlert() {
    return this.page.getByText(
      "не проверена модератором и не видна пользователям",
    );
  }
}
