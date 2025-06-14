// src/test.ts

import {Builder} from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";
import {Options} from "selenium-webdriver/chrome";
import path from "path";
import {TraderService} from "./services/trader.service";
import {sleep} from './utils/sleep';
import {getSymmetricPricePairs} from "./utils/trader";

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

async function run() {

    const driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options as Options)
        .build();

    await driver.get(entirePageUrl);
    await sleep(3000); // Початкова затримка

    const trader = new TraderService(driver, AMOUNT);

    while (/*await trader.isOrderBuyOpen() ||*/ 1) {
        console.log(1000*10, `"lysak sleep isOrderBuyOpen"`);

        const price = await trader.getClosePriceValue(driver, trader.selectors.lowPriceValue, "Price Input" + " (getClosePriceValue)");

        console.log(price, `"lysak price"`);

        if (price) {
            const discountedPrices = getSymmetricPricePairs(price, 0, 0);
            // console.log(discountedPrices, `"lysak"`);

            const idealPrice = discountedPrices.pairs['-0.045%'] ?? 0;
            console.log(idealPrice, `"lysak idealPrice"`);
        }

        await sleep(1000*30); // Check every minute
    }
}

run();
