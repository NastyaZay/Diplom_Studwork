// test и expect берем из общей фикстуры
import { test, expect } from "../../fixtures/index.js";
import { PortfolioBuilder } from "../../api/builders/index.js";
import { ERROR_MESSAGES } from "../../api/constants/index.js";

// Кейсы: полный жизненный цикл портфолио — создать, изменить, удалить, проверить отсутствие.
// Тесты идут по очереди (workers: 1), id создается в позитивном тесте и передается дальше.
test.describe("Портфолио — CRUD", () => {
  // id созданного портфолио. Заполняется в позитивном create-тесте, используется дальше.
  let createdId;

  // --- Кейс 1: СОЗДАНИЕ портфолио ---

  test(
    "POST /portfolio — НЕГАТИВ: пустой title возвращает 400",
    { tag: "@portfolio" },
    async ({ apiFacade }) => {
      // авторизуемся, чтобы получить токен
      await apiFacade.authorize();
      // грузим превью — fileIds обязательное поле, без него причина отказа была бы другой
      const { fileId } = await apiFacade.uploadPreview();

      // готовим тело с пустым заголовком (нарушает правило "Title обязателен")
      const payload = new PortfolioBuilder()
        .withEmptyTitle()
        .withFileIds([fileId])
        .build();

      // пытаемся создать
      const { status, body } = await apiFacade.portfolio.create(payload);

      // ждем ошибку 400 Bad Request
      expect(status).toBe(400);
      // содержательная проверка: сервер вернул осмысленную ошибку валидации про Title
      expect(body).toHaveProperty("error");
      expect(body.error).toBe(ERROR_MESSAGES.EMPTY_TITLE);
      expect(body.status).toBe(400);
    },
  );

  test(
    "POST /portfolio — ПОЗИТИВ: создает портфолио, данные совпадают с отправленными",
    { tag: "@portfolio" },
    async ({ apiFacade }) => {
      await apiFacade.authorize();
      // грузим файл-превью и берем его id для обязательного поля fileIds
      const upload = await apiFacade.uploadPreview();

      // проверяем, что файл действительно загрузился
      expect(upload.status).toBe(201);
      expect(upload.fileId).toBeDefined();
      const fileId = upload.fileId;

      // собираем валидное тело билдером, кладем реальный id загруженного файла
      const payload = new PortfolioBuilder().withFileIds([fileId]).build();

      // создаем портфолио
      const { status, body } = await apiFacade.portfolio.create(payload);

      // ждем успешное создание: 201 Created
      expect(status).toBe(201);
      // данные портфолио лежат в body.portfolio
      expect(body.portfolio.id).toBeDefined();
      // проверяем, что данные пришли такие, как мы заполнили
      expect(body.portfolio.title).toBe(payload.title);
      expect(body.portfolio.text).toBe(payload.text);
      expect(body.portfolio.disciplineId).toBe(payload.disciplineId);
      expect(body.portfolio.workTypeId).toBe(payload.workTypeId);
      // загруженный файл прикрепился к портфолио
      expect(body.portfolio.files[0].id).toBe(fileId);

      // запоминаем id для следующих тестов (изменить/удалить/проверить)
      createdId = body.portfolio.id;
    },
  );

  // --- Кейс 2: ИЗМЕНЕНИЕ портфолио (берем id созданного выше) ---

  test(
    "PUT /portfolio/{id} — НЕГАТИВ: title меньше 10 символов возвращает 400",
    { tag: "@portfolio" },
    async ({ apiFacade }) => {
      await apiFacade.authorize();
      //используем id, созданный в позитивном create-тесте
      expect(
        createdId,
        "createdId не заполнен — упал позитивный create?",
      ).toBeDefined();
      const { fileId } = await apiFacade.uploadPreview();

      // title короче 10 символов — нарушает правило "минимум 10 символов"
      const payload = new PortfolioBuilder()
        .withTooShortTitle()
        .withFileIds([fileId])
        .build();

      // пытаемся обновить созданное ранее портфолио невалидными данными
      const { status, body } = await apiFacade.portfolio.update(
        createdId,
        payload,
      );

      // ждем ошибку 400 Bad Request
      expect(status).toBe(400);
      // содержательная проверка: в теле осмысленная ошибка про минимум 10 символов
      expect(body).toHaveProperty("error");
      // строгая сверка точного текста ошибки с эталоном из констант
      expect(body.error).toBe(ERROR_MESSAGES.TITLE_MIN_LENGTH);
      expect(body.status).toBe(400);
    },
  );

  test(
    "PUT /portfolio/{id} — ПОЗИТИВ: меняет title, изменение сохраняется",
    { tag: "@portfolio" },
    async ({ apiFacade }) => {
      await apiFacade.authorize();
      //используем id, созданный в позитивном create-тесте
      expect(
        createdId,
        "createdId не заполнен — упал позитивный create?",
      ).toBeDefined();
      const { fileId } = await apiFacade.uploadPreview();

      // новый валидный заголовок
      const newTitle = "Обновленный заголовок портфолио для теста";
      const payload = new PortfolioBuilder()
        .withTitle(newTitle)
        .withFileIds([fileId])
        .build();

      // обновляем портфолио, созданное в кейсе 2
      const { status, body } = await apiFacade.portfolio.update(
        createdId,
        payload,
      );

      // ждем успех 200
      expect(status).toBe(200);
      // проверяем, что измененное поле действительно обновилось
      expect(body.portfolio.title).toBe(newTitle);
    },
  );

  // --- Кейс 3: УДАЛЕНИЕ портфолио (берем id предыдущего) ---

  test(
    "DELETE /portfolio/{id} — удаляет портфолио, после чего его больше нет",
    { tag: "@portfolio" },
    async ({ apiFacade }) => {
      await apiFacade.authorize();
      // используем id, созданный в позитивном create-тесте
      expect(
        createdId,
        "createdId не заполнен — упал позитивный create?",
      ).toBeDefined();

      // удаляем портфолио
      const { status, body } = await apiFacade.portfolio.remove(createdId);

      // ждем успешное удаление: 200 и result: "success"
      expect(status).toBe(200);
      expect(body.result).toBe("success");

      // негативная проверка идемпотентности: повторно удаляем уже удаленное портфолио.
      // сущности больше нет, поэтому сервер отвечает 404

      const secondRemove = await apiFacade.portfolio.remove(createdId);
      expect(secondRemove.status).toBe(404);
      expect(secondRemove.body).toHaveProperty("error");
      // сверка точного текста ошибки
      expect(secondRemove.body.error).toBe(ERROR_MESSAGES.PORTFOLIO_NOT_FOUND);
    },
  );

  // --- Кейс 4: ПРОСМОТР удаленного портфолио (берем id из теста выше) ---

  test(
    "GET /portfolio/{id} — удаленного портфолио больше нет (404)",
    { tag: "@portfolio" },
    async ({ apiFacade }) => {
      await apiFacade.authorize();
      //используем id, созданный в позитивном create-тесте
      expect(
        createdId,
        "createdId не заполнен — упал позитивный create?",
      ).toBeDefined();

      // пытаемся получить уже удаленное портфолио
      const { status, body } = await apiFacade.portfolio.getById(createdId);

      // такого портфолио больше нет — ждем 404 Not Found
      expect(status).toBe(404);
      // содержательная проверка: сервер вернул ошибку "не найдено"
      expect(body).toHaveProperty("error");
      // строгая сверка точного текста ошибки с эталоном из констант
      expect(body.error).toBe(ERROR_MESSAGES.PORTFOLIO_NOT_FOUND);
      expect(body.status).toBe(404);
    },
  );
});
