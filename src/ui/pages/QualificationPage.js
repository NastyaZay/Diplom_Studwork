// Форма "Подтверждение квалификации" (/info/specialization/qualification).

export class QualificationPage {
  constructor(page) {
    this.page = page;

    this.heading = page.getByRole("heading", {
      name: "Подтверждение квалификации",
    });

    this.fioInput = page.getByPlaceholder("ФИО");
    this.linkInput = page.getByPlaceholder("Ссылка на страницу в соц.сети");

    // скрытый input[type=file] для документов
    this.fileInput = page.locator('input[type="file"].button-file__input');

    // карточка загруженного файла в списке (появление = файл загружен)
    this.uploadedFileName = page
      .locator(".qualification-files__list .file")
      .filter({ visible: true });

    // чекбокс согласия: кликабельная область - label
    this.consentCheckbox = page.locator("label.sf-check", {
      has: page.locator('input[name="terms"]'),
    });

    this.submitButton = page.getByRole("button", { name: "Отправить запрос" });
  }

  async fillFio(fio) {
    await this.fioInput.fill(fio);
  }

  async fillLink(link) {
    await this.linkInput.fill(link);
  }

  // загрузить файл напрямую в input (рекомендованный способ Playwright)
  async uploadFile(filePath) {
    await this.fileInput.setInputFiles(filePath);
  }

  // заполнить форму квалификации: ФИО, ссылка, файл
  async fillForm(data, filePath) {
    await this.fillFio(data.fio);
    await this.fillLink(data.link);
    await this.uploadFile(filePath);
  }

  async acceptConsent() {
    await this.consentCheckbox.click();
  }

  async clickSubmit() {
    await this.submitButton.waitFor({ state: "visible" });
    await this.submitButton.click();
  }
}
