import {
  AuthService,
  PortfolioService,
  FileService,
} from "../services/index.js";
import { AuthBuilder } from "../builders/index.js";
import { readPreviewFile } from "../helpers/index.js";

export class ApiFacade {
  constructor({ request }) {
    this.request = request;
    this.token = null;

    // Создаем сервисы. Пока без токена — защищенные сервисы получат его после авторизации.
    this.auth = new AuthService({ request });
    this.portfolio = new PortfolioService({ request });
    this.file = new FileService({ request });
  }

  // authorize — служебный шаг: получаем токен и раздаем его защищенным сервисам.
  // Возвращает ответ авторизации, чтобы тест мог проверить статус и сам токен.
  async authorize() {
    const credentials = new AuthBuilder().build();
    const response = await this.auth.getToken(credentials);

    // сохраняем токен и прокидываем его во все защищенные сервисы
    this.token = response.body?.token ?? null;
    this.portfolio.token = this.token;
    this.file.token = this.token;

    return response;
  }

  // uploadPreview — служебный шаг: грузим тестовый файл-превью
  // Сервис сам вернет id файла (нужен для поля fileIds при создании портфолио).
  async uploadPreview() {
    const file = readPreviewFile();
    return this.file.uploadPreview(file);
  }
}
