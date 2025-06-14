import {By, until, WebDriver, Key, WebElement} from "selenium-webdriver";
import {sleep} from '../utils/sleep';

export class TraderService {
    private readonly driver: WebDriver;
    private PRICE: number = 0;
    private readonly AMOUNT: number = 0;

    private DELAY = 1000;

    private selectors = {
        limitButton: By.css("#bn-tab-LIMIT"),
        instantButton: By.css("#bn-tab-INSTANT"),
        buySectionButton: By.css(".bn-tabs.bn-tabs__buySell #bn-tab-0"),
        sellSectionButton: By.css(".bn-tabs.bn-tabs__buySell #bn-tab-1"),
        buyButton: By.css("button[data-bn-type='submit'][class*='Buy']"),
        sellButton: By.css("button[data-bn-type='submit'][class*='Sell']"),
        price: By.css("#limitPrice"),
        total: By.css("#limitTotal"),
        closePriceValue: By.css(".chart-title-row .chart-title-indicator-container .default-label-box[key=\"c\"]"),
        lowPriceValue: By.css(".chart-title-row .chart-title-indicator-container .default-label-box[key=\"l\"]")
    };

    constructor(driver: WebDriver, amount: number) {
        this.driver = driver;
        this.AMOUNT = amount;
    }

    async init() {
        this.PRICE = await this.getIdealPrice();
    }

    private async getIdealPrice() {
        if (0) {
            const price = await this.getClosePriceValue(this.driver, this.selectors.lowPriceValue, "Price Input" + " (getClosePriceValue)");

            if (!price) {
                throw new Error('no price')
            }

            console.log(price, `"lysak price"`);
            console.log(+price, `"lysak +price"`);

            const discountedPrices = this.getSymmetricPricePairs(+price, 0, 0);

            console.log(discountedPrices, `"lysak"`);

            const idealPrice = discountedPrices.pairs['-0.045%'] ?? 0;
            console.log(idealPrice, `"lysak idealPrice"`);

            return +idealPrice;
        }

        return +'2.00942';
    }

    async buyAction() {
        await this.click(this.driver, this.selectors.buySectionButton, "Buy Tab");

        await this.click(this.driver, this.selectors.limitButton, "Limit Tab");
        // await this.click(this.driver, this.selectors.instantButton, "Instant Tab");
        // await this.click(this.driver, this.selectors.limitButton, "Limit Tab");

        await this.typeIntoField(this.driver, this.selectors.price, this.PRICE.toString(), "Price Input buyAction");
        await this.typeIntoField(this.driver, this.selectors.total, this.AMOUNT.toString(), "Total Input buyAction");
        console.log("Buy action completed");
    }

    async sellAction() {
        await this.click(this.driver, this.selectors.sellSectionButton, "Sell Tab");

        await this.click(this.driver, this.selectors.limitButton, "Limit Tab");
        // await this.click(this.driver, this.selectors.instantButton, "Instant Tab");
        // await this.click(this.driver, this.selectors.limitButton, "Limit Tab");

        await this.typeIntoField(this.driver, this.selectors.price, this.PRICE.toString(), "Price Input sellAction");
        await this.typeIntoField(this.driver, this.selectors.total, this.AMOUNT.toString(), "Total Input sellAction");
        console.log("Sell action completed");
    }

    async isOrderBuyOpen(): Promise<boolean> {
        // This logic was previously in main.ts
        const result = await this.getValue(this.driver, this.selectors.lowPriceValue, "isOrderBuyOpen");
        return result === 'Buy';
    }

    getSymmetricPricePairs(basePrice: number, high: number, low: number) {
        const startPct = 0.0002;  // 0.02%
        const endPct = 0.0008;    // 0.08%
        const step = 0.00005;     // 0.005%

        const truncate5 = (n: number): number => Number(n.toFixed(5));

        const midPrice = (high: number, low: number): number => {
            const result = (high + low) / 2;
            return Number(result.toFixed(5));
        };

        const percentLabel = (p: number): string =>
            `${p >= 0 ? '+' : ''}${(p * 100).toFixed(3)}%`;

        // Temporary storage for paired values
        const tempPairs: [string, number][] = [];

        // Use the specified step pattern for increments
        for (let pct = startPct; pct <= endPct; pct += step) {
            const plus = truncate5(basePrice * (1 + pct));
            const minus = truncate5(basePrice * (1 - pct));

            tempPairs.push([percentLabel(pct), plus]);
            tempPairs.push([percentLabel(-pct), minus]);
        }

        // Sort the array by percentage values (as numbers from negative to positive)
        tempPairs.sort(([labelA], [labelB]) => {
            const percentageToNumber = (label: string) => parseFloat(label.replace('%', ''));
            return percentageToNumber(labelA) - percentageToNumber(labelB);
        });

        // Create a hashmap of sorted pairs
        const pairs: { [key: string]: number } = {};
        tempPairs.forEach(([label, value]) => {
            pairs[label] = value;
        });

        return {
            midPrice: midPrice(high, low),
            basePrice: truncate5(basePrice),
            pairs
        };
    }

    async getValue(driver: WebDriver, selector: By, label = ""): Promise<string> {
        try {
            const element = await driver.wait(until.elementLocated(selector), this.DELAY);
            const value = await element.getText();
            await sleep(1000);
            return value;
        } catch (err) {
            console.error(`Error getting from ${label || 'label'}:`, err);
            throw err;
        }
    }

    async getClosePriceValue(driver: WebDriver, selector: By, label = ""): Promise<number | null> {
        try {
            return +await this.getValue(driver, selector, label);
        } catch (err) {
            console.error(`Error getting from ${label || 'label'}:`, err);
            return null;
        }
    }

    async typeIntoField(driver: WebDriver, selector: By, value: string, label = "") {
        try {
            const element = await driver.wait(until.elementLocated(selector), this.DELAY);

            await driver.wait(until.elementIsVisible(element), this.DELAY);

            await this.clearInput(element);

            for (const char of value.split('')) {
                await element.sendKeys(char);
                await sleep(Math.random() * 100 + 50);
            }
            console.log(`Typed ${value} into ${label || 'field'}`);
            await sleep(1000);
        } catch (err) {
            console.error(`Error typing into ${label || 'field'}:`, err);
        }
    }

    async clearInput(element: WebElement) {
        const currentValue = await element.getAttribute('value');
        if (!currentValue) return;

        for (let i = 0; i < currentValue.length; i++) {
            await element.sendKeys(Key.BACK_SPACE);
            await sleep(30);
        }
    }

    async click(driver: WebDriver, selector: By, label = "", wait = 3000) {
        const el = await driver.wait(until.elementLocated(selector), this.DELAY);
        await driver.wait(until.elementIsVisible(el), this.DELAY);
        console.log(`Клік по: ${label}`);
        await el.click();
        await sleep(wait);
    }
}
