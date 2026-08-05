// Setup инфраструктурного входа Dex. Сохраняет сессию стенда в user.json.
// Стенд может быть с экраном Dex (проходим три экрана) или без него (главная сразу, если включен рабочий vpn).

import { test as setup, expect } from "@playwright/test";
import "dotenv/config";
import { ProxyPage, DexLoginPage, GrantAccessPage } from "../ui/pages/index.js";

const STORAGE_STATE = "playwright/.auth/user.json";

setup("аутентификация через OAuth2 Proxy + Dex", async ({ page }) => {
  const baseURL = process.env.BASE_URL;
  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;

  if (!baseURL) {
    throw new Error("Не задана переменная окружения BASE_URL. Проверь .env");
  }

  const proxyPage = new ProxyPage(page);
  const dexLoginPage = new DexLoginPage(page);
  const grantAccessPage = new GrantAccessPage(page);

  await proxyPage.open(baseURL);

  // проходим экран Dex только если он показан
  const dexVisible = await proxyPage.isDexScreenVisible();

  if (dexVisible) {
    if (!email || !password) {
      throw new Error(
        "Показан экран Dex, но не заданы TEST_USER_EMAIL / TEST_USER_PASSWORD в .env",
      );
    }

    await proxyPage.clickSignInWithDex();
    await dexLoginPage.login(email, password);
    await grantAccessPage.grantAccess();

    await page.waitForURL((url) => url.href.startsWith(baseURL));
    await expect(
      page.getByRole("button", { name: "Sign in with Dex" }),
    ).toHaveCount(0);
  } else {
    await page.waitForURL((url) => url.href.startsWith(baseURL));
  }

  // сохраняем сессию - ее подхватят зависимые проекты через storageState
  await page.context().storageState({ path: STORAGE_STATE });
});
