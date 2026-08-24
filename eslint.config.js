import js from "@eslint/js";

export default [
  // 1) Папки, которые линтер вообще не смотрит (сгенерированное и служебное).
  {
    ignores: [
      "node_modules/**",
      "allure-results/**",
      "allure-report/**",
      "playwright-report/**",
      "test-results/**",
      "playwright/.auth/**",
      "results.json",
    ],
  },

  // 2) Базовый набор рекомендованных правил от команды ESLint.
  //    Ловит настоящие ошибки: дубли ключей, недостижимый код и т.п.
  js.configs.recommended,

  // 3) Мои настройки под проект
  {
    // на какие файлы распространяется
    files: ["**/*.js"],

    languageOptions: {
      // проект на современном JS с import/export (ESM)
      ecmaVersion: 2023,
      sourceType: "module",

      // глобальные переменные окружения Node.js (process, console и пр.),
      // чтобы линтер не считал их "необъявленными".
      globals: {
        process: "readonly",
        console: "readonly",
        module: "readonly",
        require: "readonly",
        __dirname: "readonly",
        Buffer: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        URL: "readonly",
      },
    },

    rules: {
      // Неиспользуемые переменные - показываем ЖЕЛТЫМ (не критично, но полезно видеть).
      // args: "none" - не ругаться на неиспользуемые аргументы функций
      // (у фикстур Playwright часто так: ({ page }, use) => ...).
      "no-unused-vars": ["warn", { args: "none" }],

      // console.log оставляем разрешенным: в тестовом проекте это нормально.
      "no-console": "off",

      // Ловим реально опасную опечатку "=" вместо "==" в условии - но ЖЕЛТЫМ.
      "no-cond-assign": ["warn", "always"],

      // Пустой паттерн {} в аргументах - это НЕ ошибка, а штатный прием фикстур
      // Playwright: cleanup: async ({}, use) => ... означает "другие фикстуры не нужны".
      // Оставляем ЖЕЛТЫМ, чтобы красным не подчеркивало.
      "no-empty-pattern": "warn",
    },
  },
];
