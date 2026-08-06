// Единый конфиг для UI и API тестов.
//
// UI: baseURL из .env (BASE_URL), аутентификация через setup-проект,
// переиспользование сессий через storageState. Каждый прикладной сценарий -
// отдельный проект, чтобы задать нужную сессию и порядок через dependencies.
//
// API: отдельные проекты api, которые НЕ зависят от setup и не открывают браузер.
// Базовый адрес API берется внутри API-фикстуры из .env (API_BASE_URL), потому что
// это другой хост, чем у UI.
//
// Цепочка входов на стенде (UI):
//   setup (Dex)      -> user.json            (инфраструктурный доступ к стенду)
//   login            -> studwork.json        (прикладной вход в форму studwork)
//   registration     -> registered-user.json (сессия нового пользователя)

import { defineConfig } from "@playwright/test";
import "dotenv/config";

// файлы сессий (storageState)
const DEX = "playwright/.auth/user.json";
const STUDWORK = "playwright/.auth/studwork.json";
const REGISTERED = "playwright/.auth/registered-user.json";

export default defineConfig({
  testDir: "./tests",
  reporter: [
    ["list"],
    ["html", { open: "never" }],
    ["json", { outputFile: "results.json" }],
    // allure-playwright пишет сырые результаты в папку allure-results.
    // Из нее локально собирается HTML-отчет (allure generate),
    // и эти же результаты заливаются в Allure TestOps через allurectl на CI.
    ["allure-playwright", { resultsDir: "allure-results" }],
  ],
  // workers: 1 — тесты идут по очереди. Важно и для UI (общая сессия/данные),
  // и для API (кейсы портфолио связаны: создаем -> меняем -> удаляем именно его).
  workers: 1,

  use: {
    // baseURL для UI-страниц (page.goto). API свой baseURL берет в фикстуре из .env.
    baseURL: process.env.BASE_URL,
    trace: "on",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    ignoreHTTPSErrors: true,
  },

  projects: [
    // ================= API =================
    // API-проекты не зависят от Dex-сессии и браузера — работают по http.

    // Авторизация по API
    {
      name: "api-auth",
      testMatch: "**/tests/api/auth.spec.js",
    },
    // Портфолио: CRUD по API
    {
      name: "api-portfolio",
      testMatch: "**/tests/api/portfolio.spec.js",
    },

    // ================= UI =================

    // 1. Инфраструктурный вход Dex -> user.json
    {
      name: "setup",
      testMatch: /auth\.setup\.js/,
    },

    // 2. UI-доступ (стартует после Dex). Один браузер - chromium.
    {
      name: "ui-chromium",
      testMatch: "**/authorized-access.ui.spec.js",
      use: { browserName: "chromium", storageState: DEX },
      dependencies: ["setup"],
    },

    // 3. Прикладной вход studwork -> studwork.json
    {
      name: "login",
      testMatch: "**/login.positive.spec.js",
      use: { browserName: "chromium", storageState: DEX },
      dependencies: ["setup"],
    },

    // 4. Магазин: негатив и позитив (стартуют залогиненными)
    {
      name: "shop",
      testMatch: "**/add-shop-work.*.spec.js",
      use: { browserName: "chromium", storageState: STUDWORK },
      dependencies: ["login"],
    },

    // 5. Финансы: негатив и позитив (стартуют залогиненными)
    {
      name: "finance",
      testMatch: "**/add-wallet-sbp.*.spec.js",
      use: { browserName: "chromium", storageState: STUDWORK },
      dependencies: ["login"],
    },

    // 6. Регистрация нового пользователя -> registered-user.json (стартует гостем)
    {
      name: "registration",
      testMatch: "**/registration.positive.spec.js",
      use: { browserName: "chromium", storageState: DEX },
      dependencies: ["setup"],
    },

    // 7. Квалификация (стартует под зарегистрированным пользователем)
    {
      name: "qualification",
      testMatch: "**/qualification.positive.spec.js",
      use: { browserName: "chromium", storageState: REGISTERED },
      dependencies: ["registration"],
    },
  ],
});
