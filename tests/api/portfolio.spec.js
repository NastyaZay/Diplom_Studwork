// test и expect берем из общей фикстуры
import { test, expect } from "../../fixtures/index.js";
import { PortfolioBuilder } from "../../api/builders/index.js";

// Кейсы: создание портфолио (негатив + позитив)
// Этим тестам не нужно готовое портфолио — они сами его создают, поэтому beforeEach тут не нужен.
test.describe("Портфолио — создание", () => {
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
      expect(body.error).toBe("Необходимо заполнить «Title».");
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
    },
  );
});

// ИЗМЕНЕНИЕ / УДАЛЕНИЕ / ЧТЕНИЕ портфолио
// Этим тестам нужно готовое портфолио. beforeEach создает его заново перед каждым тестом,
// поэтому тесты независимы: каждый работает со своим портфолио, а не с чужим id.
test.describe("Портфолио — изменение, удаление, чтение", () => {
  // id портфолио, созданного в beforeEach. Принадлежит именно текущему тесту.
  let createdId;

  // готовим свежее портфолио перед КАЖДЫМ тестом группы
  test.beforeEach(async ({ apiFacade }) => {
    // авторизуемся
    await apiFacade.authorize();
    // грузим превью и берем id файла
    const { fileId } = await apiFacade.uploadPreview();
    // собираем валидное тело и создаем портфолио
    const payload = new PortfolioBuilder().withFileIds([fileId]).build();
    const { body } = await apiFacade.portfolio.create(payload);
    // запоминаем id ИМЕННО этого теста
    createdId = body.portfolio.id;
  });

  // Кейсы: Изменение (негатив + позитив)
  test(
    "PUT /portfolio/{id} — НЕГАТИВ: title меньше 10 символов возвращает 400",
    { tag: "@portfolio" },
    async ({ apiFacade }) => {
      const { fileId } = await apiFacade.uploadPreview();

      // title короче 10 символов — нарушает правило "минимум 10 символов"
      const payload = new PortfolioBuilder()
        .withTooShortTitle()
        .withFileIds([fileId])
        .build();

      // пытаемся обновить свое портфолио невалидными данными
      const { status, body } = await apiFacade.portfolio.update(
        createdId,
        payload,
      );

      // ждем ошибку 400 Bad Request
      expect(status).toBe(400);
      // содержательная проверка: в теле осмысленная ошибка про минимум 10 символов
      expect(body).toHaveProperty("error");
      // строгая сверка точного текста ошибки
      expect(body.error).toBe(
        "Значение «Title» должно содержать минимум 10 символов.",
      );
      expect(body.status).toBe(400);
    },
  );

  test(
    "PUT /portfolio/{id} — ПОЗИТИВ: меняет title, изменение сохраняется",
    { tag: "@portfolio" },
    async ({ apiFacade }) => {
      const { fileId } = await apiFacade.uploadPreview();

      // новый валидный заголовок
      const newTitle = "Обновленный заголовок портфолио для теста";
      const payload = new PortfolioBuilder()
        .withTitle(newTitle)
        .withFileIds([fileId])
        .build();

      // обновляем свое портфолио
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

  // Кейсы: Удаление (позитив + негатив) )
  test(
    "DELETE /portfolio/{id} — удаляет портфолио, после чего его больше нет",
    { tag: "@portfolio" },
    async ({ apiFacade }) => {
      // удаляем свое портфолио
      const { status, body } = await apiFacade.portfolio.remove(createdId);

      // ждем успешное удаление: 200 и result: "success"
      expect(status).toBe(200);
      expect(body.result).toBe("success");

      // проверка идемпотентности: повторно удаляем уже удаленное портфолио.
      // сущности больше нет, поэтому сервер отвечает 404
      const secondRemove = await apiFacade.portfolio.remove(createdId);
      expect(secondRemove.status).toBe(404);
      expect(secondRemove.body).toHaveProperty("error");
      // сверка точного текста ошибки
      expect(secondRemove.body.error).toBe("Портфолио не найдено");
    },
  );

  // Кейс: Просмотр удаленного портфолио
  test(
    "GET /portfolio/{id} — удаленного портфолио больше нет (404)",
    { tag: "@portfolio" },
    async ({ apiFacade }) => {
      // сначала удаляем свое портфолио, чтобы проверить, что удаленного действительно нет
      const remove = await apiFacade.portfolio.remove(createdId);
      expect(remove.status).toBe(200);

      // пытаемся получить уже удаленное портфолио
      const { status, body } = await apiFacade.portfolio.getById(createdId);

      // такого портфолио больше нет — ждем 404 Not Found
      expect(status).toBe(404);
      // содержательная проверка: сервер вернул ошибку "не найдено"
      expect(body).toHaveProperty("error");
      // строгая сверка точного текста ошибки
      expect(body.error).toBe("Портфолио не найдено");
      expect(body.status).toBe(404);
    },
  );
});
