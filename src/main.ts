import {Builder} from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";
import {Options} from "selenium-webdriver/chrome";
import path from "path";
import {TraderService} from "./services/trader.service";
import {sleep} from './utils/sleep';

const entirePageUrl = 'https://www.binance.com/en/alpha/bsc/0xc71b5f631354be6853efe9c3ab6b9590f8302e81';

// const AMOUNT = 800;
const AMOUNT: number = +"0.05";

// Налаштування профілю з унікальним ідентифікатором для уникнення конфліктів
const profilePath = path.resolve(__dirname, `../profiles/1`);
const options = new chrome.Options()
    .addArguments(`--user-data-dir=${profilePath}`)
    .addArguments('--no-sandbox')
    .addArguments('--disable-dev-shm-usage')
    .addArguments('--disable-blink-features=AutomationControlled')
    .addArguments('--start-maximized');

// Set ChromeDriver to not wait for the page to load completely
options.setPageLoadStrategy('normal');

async function main() {
    const driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options as Options)
        .build();

    try {
        await driver.get(entirePageUrl);
        await sleep(3000); // Початкова затримка

        const trader = new TraderService(driver, AMOUNT);
        await trader.init();

        while (await trader.isOrderBuyOpen()) {
            console.log(1000, `"lysak sleep isOrderBuyOpen"`);
            await sleep(1000); // Check every minute
        }

        console.log('sold', `"lysak"`);

        // Example of running actions
        await trader.buyAction();
        await sleep(1500);
        await trader.sellAction();

        // Keep the browser open for manual testing
        console.log("\nBrowser will remain open. You can modify the code and run again.");
        console.log("When finished, press Ctrl+C to exit the script.");

        // This will keep the script running
        while (true) {
            await sleep(60000); // Check every minute
        }
    } catch (err) {
        console.error("Сталася помилка:", err);
    } finally {
        console.log("Завершено.");
        // await driver.quit(); // Вимкни, якщо хочеш зберегти сесію
    }
}

main().then(() => console.log(`"lysak r end"`));
