import {Builder} from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";
import {Options} from "selenium-webdriver/chrome";
import path from "path";
import {TraderService} from "./services/trader.service";
import {sleep} from './utils/sleep';
import {getAdjustedPriceInfo} from "./utils/trader";

// const entirePageUrl = 'https://www.binance.com/en/alpha/bsc/0xc71b5f631354be6853efe9c3ab6b9590f8302e81';
// const entirePageUrl = 'https://www.binance.com/en/alpha/bsc/0xdac991621fd8048d9f235324780abd6c3ad26421'; //zrc
// const entirePageUrl = 'https://www.binance.com/en/alpha/bsc/0x389ad4bb96d0d6ee5b6ef0efaf4b7db0ba2e02a0'; //la
// const entirePageUrl = 'https://www.binance.com/en/alpha/bsc/0x95034f653d5d161890836ad2b6b8cc49d14e029a'; //AB
// const entirePageUrl = 'https://www.binance.com/en/alpha/bsc/0x30c60b20c25b2810ca524810467a0c342294fc61'; //TAIKO
// const entirePageUrl = 'https://www.binance.com/en/alpha/bsc/0xd6b48ccf41a62eb3891e58d0f006b19b01d50cca'; //SERAPH
// const entirePageUrl = 'https://www.binance.com/en/alpha/bsc/0xd82544bf0dfe8385ef8fa34d67e6e4940cc63e16'; //MYX
const entirePageUrl = 'https://www.binance.com/en/alpha/bsc/0xff7d6a96ae471bbcd7713af9cb1feeb16cf56b41'; //BR

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

        while (1) {
            await driver.navigate().refresh();
            console.log(`refresh`, `"lysak"`);

            const openPrice = await trader.getOpenPriceValue();
            const closePrice = await trader.getClosePriceValue();
            const lowPrice = await trader.getLowPriceValue();
            const highPrice = await trader.getHighPriceValue();

            const percentage = -0.085; // Represents -0.05%

            console.log(closePrice, `"lysak closePrice"`);

            if (closePrice) {
                const discountedPrices = getAdjustedPriceInfo(openPrice, closePrice, lowPrice, highPrice, percentage);
                console.log(discountedPrices, `"lysak"`);
            }

            const delay = trader.DELAY*3
            await sleep(delay);
        }

        // while (await trader.isOrderBuyOpen()) {
        //     await sleep(trader.DELAY);
        // }
        //
        // while (await trader.isOrderSellOpen()) {
        //     await sleep(trader.DELAY);
        // }

        console.log('sold', `"lysak sold"`);

        // Example of running actions
        await trader.buyAction();
        await sleep(trader.DELAY);
        await trader.sellAction();

        // Keep the browser open for manual testing
        console.log("\nBrowser will remain open. You can modify the code and run again.");
        console.log("When finished, press Ctrl+C to exit the script.");

        // This will keep the script running
        while (true) {
            await sleep(trader.DELAY * 60); // Check every minute
        }
    } catch (err) {
        console.error("Сталася помилка:", err);
    } finally {
        console.log("Завершено.");
        // await driver.quit(); // Вимкни, якщо хочеш зберегти сесію
    }
}

main().then(() => console.log(`"lysak r end"`));
