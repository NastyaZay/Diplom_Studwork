export class BaseService {
  // request — это playwright-контекст для http-запросов.
  // token — токен авторизации (может быть null, пока мы его еще не получили).
  constructor({ request, token = null }) {
    this.request = request;
    this.token = token;
  }

  // _headers — собираем заголовки для запроса в одном месте.
  // Если токен есть — добавляем Authorization: Bearer <token>.

  _headers(extra = {}) {
    const headers = { ...extra };
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }
    return headers;
  }
}
