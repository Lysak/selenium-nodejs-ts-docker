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

    // const url = "https://motivation-new-tab.github.io/";
    const url = "https://www.binance.com/en/alpha/bsc/0xc71b5f631354be6853efe9c3ab6b9590f8302e81";

    await driver.get(url);

    // Додай потрібну логіку

    // await driver.quit(); // ← можна закоментувати для збереження сесії
}

run().catch(console.error);
