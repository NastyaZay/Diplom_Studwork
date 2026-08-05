// Модалка подтверждения счета (2FA).
// Код подтверждения на стенде печатается в консоль браузера
// строкой вида: Confirm code "cascade-phone": 49647

export class ConfirmWalletModal {
  constructor(page) {
    this.page = page;

    this.heading = page.getByText("Подтверждение добавления счёта", {
      exact: true,
    });

    // пять полей, нужное берем по индексу через .nth()
    this.otpInputs = page.locator("input.otp-input__input");

    this.successToast = page.getByText("Счёт добавлен", { exact: true });
  }

  // Перехватить код из консоли.
  // поэтому клик "Добавить счет" передаем сюда как triggerAction.
  async captureConfirmCode(triggerAction) {
    const consoleMessagePromise = this.page.waitForEvent("console", {
      predicate: (msg) => msg.text().includes("cascade-phone"),
    });
    await triggerAction();
    const message = await consoleMessagePromise;
    return message.text().match(/\d{5}/)[0];
  }

  // разложить 5 цифр кода по 5 полям
  async fillCode(code) {
    await this.otpInputs.first().waitFor({ state: "visible" });
    const digits = code.split("");
    for (let i = 0; i < digits.length; i++) {
      await this.otpInputs.nth(i).fill(digits[i]);
    }
  }
}
