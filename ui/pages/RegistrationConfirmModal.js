// Модалка "Подтверждение регистрации".
// Код на стенде печатается в консоль строкой: Email confirmation code: 69528

export class RegistrationConfirmModal {
  constructor(page) {
    this.page = page;

    this.heading = page.getByText("Подтверждение регистрации", {
      exact: true,
    });

    // почта, на которую отправлен код
    this.emailTarget = page.locator(".email-confirmation__text__target");

    // пять полей, нужное берем по индексу через .nth()
    this.otpInputs = page.locator("input.otp-input__input");
  }

  // Перехватить код из консоли.
  async captureConfirmCode(triggerAction) {
    const consoleMessagePromise = this.page.waitForEvent("console", {
      predicate: (msg) => msg.text().includes("Email confirmation code"),
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
