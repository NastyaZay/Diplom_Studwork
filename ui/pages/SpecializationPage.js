// Страница "Специализации" (/info/specialization).

export class SpecializationPage {
  constructor(page) {
    this.page = page;

    // exact:true - иначе поймает и подзаголовок "Мои специализации"
    this.heading = page.getByRole("heading", {
      name: "Специализации",
      exact: true,
    });

    // информер над кнопкой (текст разный до и после отправки запроса)
    this.infoAlert = page.locator(".qualification-info__alert");

    // кнопка-ссылка на форму квалификации
    this.fillDataButton = page.getByRole("link", { name: "Заполнить данные" });
  }

  async clickFillData() {
    await this.fillDataButton.waitFor({ state: "visible" });
    await this.fillDataButton.click();
  }
}
