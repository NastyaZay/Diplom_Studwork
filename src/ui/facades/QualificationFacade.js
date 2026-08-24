// Facade "Отправка формы квалификации".
// Предусловие: зарегистрирован новый пользователь и авторизован (registered-user.json).

import {
  HeaderMenu,
  SpecializationPage,
  QualificationPage,
} from "../pages/index.js";

export class QualificationFacade {
  constructor(page) {
    this.page = page;
    this.menu = new HeaderMenu(page);
    this.specializationPage = new SpecializationPage(page);
    this.qualificationPage = new QualificationPage(page);
  }

  // КОНТРОЛЬНАЯ ТОЧКА 1: перейти в раздел "Специализации" через боковое меню.
  async openSpecialization() {
    await this.menu.openSpecialization();
  }

  // КОНТРОЛЬНАЯ ТОЧКА 2: открыть форму квалификации кнопкой "Заполнить данные".
  // После нее тест проверяет заголовок "Подтверждение квалификации".
  async openQualificationForm() {
    await this.specializationPage.clickFillData();
    // ожидание готовности формы (не expect)
    await this.qualificationPage.heading.waitFor({ state: "visible" });
  }

  // КОНТРОЛЬНАЯ ТОЧКА 3: заполнить форму (ФИО, ссылка, файл).
  // После нее тест проверяет, что файл прикрепился (геттер uploadedFileName).
  async fillQualificationForm(data, filePath) {
    await this.qualificationPage.fillForm(data, filePath);
  }

  // КОНТРОЛЬНАЯ ТОЧКА 4: поставить согласие и отправить запрос.
  // Объединяет чекбокс + сабмит в одно осмысленное действие "подтвердить и отправить".
  async acceptAndSubmit() {
    await this.qualificationPage.acceptConsent();
    await this.qualificationPage.clickSubmit();
  }

  // --- ГЕТТЕРЫ для проверок в тесте ---

  // заголовок "Специализации"
  get specializationHeading() {
    return this.specializationPage.heading;
  }

  // информер над кнопкой (до и после отправки текст разный)
  get infoAlert() {
    return this.specializationPage.infoAlert;
  }

  // заголовок "Подтверждение квалификации"
  get qualificationHeading() {
    return this.qualificationPage.heading;
  }

  // карточка загруженного файла (проверка, что файл прикрепился)
  get uploadedFileName() {
    return this.qualificationPage.uploadedFileName;
  }
  // тост успеха об отправке запроса на подтверждение квалификации
  get requestSentToast() {
    return this.specializationPage.requestSentToast;
  }
}
