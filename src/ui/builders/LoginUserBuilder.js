import "dotenv/config";

export class LoginUserBuilder {
  constructor() {
    this.user = { login: undefined, password: undefined };
  }

  withValidCredentials() {
    this.user.login = process.env.STUDWORK_LOGIN;
    this.user.password = process.env.STUDWORK_PASSWORD;
    return this;
  }

  build() {
    if (!this.user.login || !this.user.password) {
      throw new Error(
        "Не заданы учетные данные. Проверь .env: STUDWORK_LOGIN, STUDWORK_PASSWORD",
      );
    }
    return { ...this.user };
  }
}
