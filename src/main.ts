import { Builder } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";
import path from "path";

async function run() {
    // Шлях до chrome-профілю всередині проєкту
    const profilePath = path.resolve(__dirname, "../chrome-profile");

    const options = new chrome.Options();
    options.addArguments(`--user-data-dir=${profilePath}`);

    const driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();

    await driver.get("https://motivation-new-tab.github.io/");

    // Додай потрібну логіку

    // await driver.quit(); // ← можна закоментувати для збереження сесії
}

run().catch(console.error);
