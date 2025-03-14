// src/test.ts
import { Builder, until, WebDriver } from 'selenium-webdriver';

(async function runTest() {
    let driver: WebDriver | undefined;
    try {
        // The hostname "selenium" is resolved by Docker Compose
        driver = await new Builder()
            .forBrowser('chrome')
            .usingServer('http://selenium:4444/wd/hub')
            .build();

        // Update the URL to the website you want to test
        await driver.get('https://example.com');

        // Wait for the title to contain "Example Domain" and log it
        await driver.wait(until.titleContains('Example Domain'), 10_000);
        const title = await driver.getTitle();
        console.log(`Page title is: ${title}`);
    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        if (driver) {
            await driver.quit();
        }
    }
})();
