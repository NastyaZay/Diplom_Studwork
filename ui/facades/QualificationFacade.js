// Facade "отправка формы квалификации". Предусловие: зарегистрирован новый пользователь и авторизован.
// Шаги разбиты по бизнес-этапам, между которыми тест делает проверки.

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

  // шаг 1: Заказы через меню шапки
  async openOrders() {
    await this.menu.openOrders();
  }

  // шаг 2: "Специализации" через боковое меню
  async openSpecialization() {
    await this.menu.openSpecialization();
  }

  // шаг 3: открыть форму квалификации кнопкой "Заполнить данные"
  async openQualificationForm() {
    await this.specializationPage.clickFillData();
  }

  // шаг 4: заполнить форму (ФИО, ссылка, файл)
  async fillQualificationForm(data, filePath) {
    await this.qualificationPage.fillFio(data.fio);
    await this.qualificationPage.fillLink(data.link);
    await this.qualificationPage.uploadFile(filePath);
  }

  // шаг 5: чекбокс согласия
  async acceptConsent() {
    await this.qualificationPage.acceptConsent();
  }

  // шаг 6: отправить запрос
  async submitQualification() {
    await this.qualificationPage.clickSubmit();
  }
}
