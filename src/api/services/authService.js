import { parseBody } from "../helpers/index.js";
import { BaseService } from "./baseService.js";

export class AuthService extends BaseService {
  // getToken — POST /v1/auth/token. Получаем токен авторизации.
  // credentials — объект { login, password, recaptcha }, собранный билдером.
  async getToken(credentials) {
    const response = await this.request.post("/v1/auth/token", {
      data: credentials,
    });

    const body = await parseBody(response);
    return { status: response.status(), body };
  }
}
