import {By, until, WebDriver, Key, WebElement} from "selenium-webdriver";
import {randomDelay, sleep} from '../utils/sleep';
import {getSymmetricPricePairs} from "../utils/trader";

export class TraderService {
    private readonly driver: WebDriver;
    private PRICE: number = 0;
    private readonly AMOUNT: number = 0;

    private DELAY = 1000;

    public selectors = {
        limitButton: By.css("#bn-tab-LIMIT"),
        instantButton: By.css("#bn-tab-INSTANT"),
        buySectionButton: By.css(".bn-tabs.bn-tabs__buySell #bn-tab-0"),
        sellSectionButton: By.css(".bn-tabs.bn-tabs__buySell #bn-tab-1"),
        buyButton: By.css("button[data-bn-type='submit'][class*='Buy']"),
        sellButton: By.css("button[data-bn-type='submit'][class*='Sell']"),
        price: By.css("#limitPrice"),
        total: By.css("#limitTotal"),
        closePriceValue: By.css(".chart-title-row .chart-title-indicator-container .default-label-box[key=\"c\"]"),
        lowPriceValue: By.css(".chart-title-row .chart-title-indicator-container .default-label-box[key=\"l\"]"),
        isOrderOpen: By.css('.bn-web-table-tbody tr:not(.bn-web-table-measure-row) [aria-colindex="4"]'),
        slider: By.css('.bn-slider-wrapper input[role="slider"]'),
    };

    constructor(driver: WebDriver, amount: number) {
        this.driver = driver;
        this.AMOUNT = amount;
    }

    async init() {
        this.PRICE = await this.getIdealPrice();
    }

    private async getIdealPrice() {
        if (1) {
            const price = await this.getClosePriceValue(this.driver, this.selectors.lowPriceValue, "Price Input" + " (getClosePriceValue)");

            if (!price) {
                console.log('no price', `"lysak no price"`);
                throw new Error('no price')
            }

            const discountedPrices = getSymmetricPricePairs(price, 0, 0);

            console.log(discountedPrices, `"lysak discountedPrices"`);

            const idealPrice = discountedPrices.pairs['-0.045%'] ?? 0;
            console.log(idealPrice, `"lysak idealPrice 2"`);
            //TODO: debug temp
            // return +idealPrice;
        }

        return +'2.00942';
    }

    async buyAction() {
        await this.click(this.driver, this.selectors.buySectionButton, "Buy Tab");

        await this.click(this.driver, this.selectors.limitButton, "Limit Tab");

        await this.typeIntoField(this.driver, this.selectors.price, this.PRICE.toString(), "Price Input buyAction");

        await this.dragSliderTo100(this.driver, this.selectors.slider)

        // await this.typeIntoField(this.driver, this.selectors.total, this.AMOUNT.toString(), "Total Input buyAction");
        console.log("Buy action completed");
    }

    async sellAction() {
        await this.click(this.driver, this.selectors.sellSectionButton, "Sell Tab");

        await this.click(this.driver, this.selectors.limitButton, "Limit Tab");

        await this.typeIntoField(this.driver, this.selectors.price, this.PRICE.toString(), "Price Input sellAction");
        await this.dragSliderTo100(this.driver, this.selectors.slider)
        // await this.typeIntoField(this.driver, this.selectors.total, this.AMOUNT.toString(), "Total Input sellAction");
        console.log("Sell action completed");
    }

    async isOrderBuyOpen(): Promise<boolean> {
        try {
            const result = await this.getValue(this.driver, this.selectors.isOrderOpen, "isOrderBuyOpen");

            console.log(result, `"lysak result"`);

            return result === 'Buy';
        } catch (err) {
            console.log(err, `"lysak err"`);
            return false;
        }
    }

    async isOrderSellOpen(): Promise<boolean> {
        try {
            const result = await this.getValue(this.driver, this.selectors.isOrderOpen, "isOrderBuyOpen");

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

            await sleep(1000);

            await this.clearInput(element);

            for (const char of value.split('')) {
                await element.sendKeys(char);
                await sleep(randomDelay(25, 50), 0, 0);
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


    async dragSliderTo100(driver: WebDriver, sliderSelector: By) {
        const slider = await driver.wait(until.elementLocated(sliderSelector), 5000);
        await driver.wait(until.elementIsVisible(slider), 5000);
        await driver.wait(until.elementIsEnabled(slider), 5000);

        const rect = await slider.getRect();
        console.log("Slider rect:", rect);

        const actions = driver.actions({ async: true });

        // Виправлено: обережно переміщаємося до правої межі
        actions
            .move({origin: slider, x: 0, y: rect.height / 2}) // старт з самого початку
            .press();

        // Рухаємо поетапно, щоб уникнути out-of-bounds
        const step = 60;
        const totalSteps = Math.floor(rect.width / step);
        for (let i = 0; i < totalSteps; i++) {
            actions.move({origin: slider, x: step, y: 0});
        }

        await actions.release().perform();

        console.log("Slider dragged in steps to ~100%");
    }

    async dragSliderTo1002(driver: WebDriver, sliderSelector: By) {
        const slider = await driver.wait(until.elementLocated(sliderSelector), 5000);
        await driver.wait(until.elementIsVisible(slider), 5000);
        await driver.wait(until.elementIsEnabled(slider), 5000);

        const rect = await slider.getRect();
        console.log("Slider rect:", rect);

        const actions = driver.actions({ async: true });

        const centerY = Math.floor(rect.height / 2);
        const totalDistance = Math.floor(rect.width * 0.95); // avoid max edge (out-of-bounds)

        const step = 20;
        let moved = 0;

        actions.move({ origin: slider, x: 0, y: centerY }).press();

        while (moved < totalDistance) {
            moved += step;
            actions.move({ x: step, y: 0 }); // no origin = move from the current pointer position
        }

        await actions.release().perform();

        console.log("Slider dragged incrementally to ~100%");
    }

    async setSliderTo100(driver: WebDriver, sliderSelector: By) {
        const slider = await driver.wait(until.elementLocated(sliderSelector), 5000);
        await driver.wait(until.elementIsVisible(slider), 5000);

        await driver.executeScript(`
        const input = arguments[0];
        input.value = 80;

        // Викликаємо події, щоб фронт побачив зміну
        const inputEvent = new Event('input', { bubbles: true });
        const changeEvent = new Event('change', { bubbles: true });

        input.dispatchEvent(inputEvent);
        input.dispatchEvent(changeEvent);
    `, slider);

        console.log("Slider set to 100% via JS");
    }
}
