import {By, until, WebDriver, Key, WebElement} from "selenium-webdriver";
import {randomDelay, sleep} from '../utils/sleep';
import {getAdjustedPriceInfo} from "../utils/trader";
import {selectors} from "../utils/selectors";

export class TraderService {
    public readonly driver: WebDriver;
    public PRICE: number = 0;
    public readonly AMOUNT: number = 0;

    public DELAY = 1000;

    constructor(driver: WebDriver, amount: number) {
        this.driver = driver;
        this.AMOUNT = amount;
    }

    async init() {
        // this.PRICE = await this.getIdealPrice();
    }

    // private async getIdealPrice() {
    //     // if (1) {
    //     //     const closePrice = await this.getClosePriceValue();
    //     //     const lowPrice = await this.getLowPriceValue();
    //     //     const highPrice = await this.getHighPriceValue();
    //     //
    //     //     const percent = '-0.005';
    //     //
    //     //     if (!closePrice) {
    //     //         console.log('no closePrice', `"lysak no closePrice"`);
    //     //         throw new Error('no closePrice')
    //     //     }
    //     //
    //     //     const discountedPrices = getAdjustedPriceInfo(closePrice, lowPrice, highPrice, percent);
    //     //
    //     //     console.log(discountedPrices, `"lysak discountedPrices"`);
    //     //
    //     //     //
    //     //     //
    //     //     // const idealPrice = discountedPrices.pairs[percent] ?? 0;
    //     //     // console.log(idealPrice, `"lysak idealPrice 2"`);
    //     //     //TODO: debug temp
    //     //     // return +idealPrice;
    //     // }
    //
    //     // return +'2.00942';
    // }

    async buyAction() {
        await this.click(this.driver, selectors.buySectionButton, "Buy Tab");

        await this.click(this.driver, selectors.limitButton, "Limit Tab");

        await this.typeIntoField(this.driver, selectors.price, this.PRICE.toString(), "Price Input buyAction");

        await this.dragSliderTo100(this.driver, selectors.slider)

        console.log("Buy action completed");
    }

    async sellAction() {
        await this.click(this.driver, selectors.sellSectionButton, "Sell Tab");

        await this.click(this.driver, selectors.limitButton, "Limit Tab");

        await this.typeIntoField(this.driver, selectors.price, this.PRICE.toString(), "Price Input sellAction");

        await this.dragSliderTo100(this.driver, selectors.slider)

        console.log("Sell action completed");
    }

    async isOrderBuyOpen(): Promise<boolean> {
        try {
            const result = await this.getValue(this.driver, selectors.isOrderOpen, "isOrderBuyOpen");

            console.log(result, `"lysak result"`);

            return result === 'Buy';
        } catch (err) {
            console.log(err, `"lysak err"`);
            return false;
        }
    }

    async isOrderSellOpen(): Promise<boolean> {
        try {
            const result = await this.getValue(this.driver, selectors.isOrderOpen, "isOrderBuyOpen");

            console.log(result, `"lysak result"`);

            return result === 'Sell';
        } catch (err) {
            console.log(err, `"lysak err"`);
            return false;
        }
    }

    async getValue(driver: WebDriver, selector: By, label = ""): Promise<string> {
        try {
            const element = await driver.wait(until.elementLocated(selector), this.DELAY*5);
            const value = await element.getText();
            await sleep(this.DELAY);
            return value;
        } catch (err) {
            console.error(`Error getting from ${label || 'label'}:`, err);
            throw err;
        }
    }

    async getOpenPriceValue(): Promise<number> {
        const label = "Price Input" + " (getHighPriceValue)"
        try {
            return +await this.getValue(this.driver, selectors.openPriceValue, label);
        } catch (err) {
            console.error(`Error getting from ${label || 'label'}:`, err);
            return 0;
        }
    }

    async getClosePriceValue(): Promise<number> {
        const label = "Price Input" + " (getClosePriceValue)"
        try {
            return +await this.getValue(this.driver, selectors.closePriceValue, label);
        } catch (err) {
            console.error(`Error getting from ${label || 'label'}:`, err);
            return 0;
        }
    }

    async getLowPriceValue(): Promise<number> {
        const label = "Price Input" + " (getLowPriceValue)"
        try {
            return +await this.getValue(this.driver, selectors.lowPriceValue, label);
        } catch (err) {
            console.error(`Error getting from ${label || 'label'}:`, err);
            return 0;
        }
    }

    async getHighPriceValue(): Promise<number> {
        const label = "Price Input" + " (getHighPriceValue)"
        try {
            return +await this.getValue(this.driver, selectors.highPriceValue, label);
        } catch (err) {
            console.error(`Error getting from ${label || 'label'}:`, err);
            return 0;
        }
    }

    async typeIntoField(driver: WebDriver, selector: By, value: string, label = "") {
        try {
            const element = await driver.wait(until.elementLocated(selector), this.DELAY);

            await driver.wait(until.elementIsVisible(element), this.DELAY);

            await sleep(this.DELAY);

            await this.clearInput(element);

            for (const char of value.split('')) {
                await element.sendKeys(char);
                await sleep(randomDelay(25, 50), 0, 0);
            }
            console.log(`Typed ${value} into ${label || 'field'}`);
            await sleep(this.DELAY);
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

    async click(driver: WebDriver, selector: By, label = "", wait = this.DELAY) {
        const el = await driver.wait(until.elementLocated(selector), this.DELAY);
        await driver.wait(until.elementIsVisible(el), this.DELAY);
        console.log(`Клік по: ${label}`);
        await el.click();
        await sleep(wait);
    }

    async dragSliderTo100(driver: WebDriver, sliderSelector: By) {
        const slider = await driver.wait(until.elementLocated(sliderSelector), this.DELAY);
        await driver.wait(until.elementIsVisible(slider), this.DELAY);
        await driver.wait(until.elementIsEnabled(slider), this.DELAY);

        const rect = await slider.getRect();

        const safeX = rect.width / 2;
        const safeY = Math.floor(rect.height / 2); // = 5

        await driver.actions({ async: true })
            .move({ origin: slider, x: rect.width/2, y: safeY }) // 360, 5
            .press()
            .release()
            .perform();

        console.log("Slider clicked at ~100%");
    }
}
