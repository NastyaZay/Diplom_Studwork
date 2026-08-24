// API-фикстура фасада. Создает отдельный http-контекст с базовым
// адресом API из .env (API_BASE_URL) и отдает в тест готовый ApiFacade.
// В тестах фасад НЕ создается вручную.

import { test as base } from "@playwright/test";
import { ApiFacade } from "../api/facade/index.js";

export const apiTest = base.extend({
  apiFacade: async ({ playwright }, use) => {
    // API живет на отдельном хосте (не там же, где UI), поэтому берем его из .env.
    const apiBaseURL = process.env.API_BASE_URL;
    if (!apiBaseURL) {
      throw new Error(
        "Не задана переменная окружения API_BASE_URL. Проверь .env",
      );
    }

    // создаем отдельный http-контекст для запросов к API
    const context = await playwright.request.newContext({
      baseURL: apiBaseURL,
      // на случай самоподписанного сертификата на dev-стенде — не падаем из-за https
      ignoreHTTPSErrors: true,
    });

    const facade = new ApiFacade({ request: context });

    // отдаем фасад в тест
    await use(facade);

    // после теста закрываем контекст
    await context.dispose();
  },
  // Удаление тестовых данных
  cleanup: async ({}, use) => {
    // список функций удаления, накопленных за тест
    const tasks = [];

    // отдаем в тест cleanup(() => apiFacade.portfolio.remove(id))
    await use((task) => {
      tasks.push(task);
    });

    // --- teardown: выполняется после теста ---
    for (const task of tasks.reverse()) {
      try {
        await task();
      } catch {
        // уборка не должна ронять прогон: если сущность уже удалена самим тестом
        // (например, DELETE-кейс), спокойно пропускаем
      }
    }
  },
});
