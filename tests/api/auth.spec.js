// API-тест: авторизация. Проверяем, что ручка токена возвращает валидный Bearer-токен.
// test и expect берем из общей фикстуры
import { test, expect } from "../../fixtures/index.js";

// Кейс 1: Авторизация — получаем токен и проверяем, что он не пустой.
test.describe("Авторизация", () => {
  test(
    "POST /v1/auth/token — возвращает токен длиннее нуля",
    { tag: "@auth" },
    async ({ apiFacade }) => {
      // выполняем авторизацию (фасад сам берет логин/пароль из билдера и .env)
      const { status, body } = await apiFacade.authorize();

      // проверяем успешный статус-код
      expect(status).toBe(200);
      // тип токена — Bearer
      expect(body.type).toBe("Bearer");
      // токен есть и это строка
      expect(typeof body.token).toBe("string");
      // главная проверка кейса: длина токена больше нуля
      expect(body.token.length).toBeGreaterThan(0);
    },
  );
});
