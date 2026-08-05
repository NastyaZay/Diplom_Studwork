export class AuthBuilder {
  constructor() {
    // Секреты (логин/пароль/капча) берем из .env — не хардкодим в коде.
    // grant_type и resolution — это не секреты, а константы запроса, поэтому держим их прямо в билдере.
    this.credentials = {
      login: process.env.STUDWORK_LOGIN,
      password: process.env.STUDWORK_PASSWORD,
      grant_type: "password",
      recaptcha: process.env.STUDWORK_RECAPTCHA,
      resolution: "981x781",
    };

    // Ранняя понятная ошибка: если секреты из .env не подхватились,
    // сразу говорим об этом, а не отправляем на сервер пустые поля.
    if (!this.credentials.login || !this.credentials.password) {
      throw new Error(
        "Переменные .env не заданы (STUDWORK_LOGIN / STUDWORK_PASSWORD). " +
          "Проверь, что файл .env лежит в корне проекта и заполнен.",
      );
    }
  }

  // задать логин вручную (например для негативных тестов)
  withLogin(login) {
    this.credentials.login = login;
    return this;
  }

  // задать пароль вручную
  withPassword(password) {
    this.credentials.password = password;
    return this;
  }

  // финальная сборка — отдаем копию объекта, чтобы билдер можно было переиспользовать
  build() {
    return { ...this.credentials };
  }
}
