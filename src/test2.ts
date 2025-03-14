// src/test2.ts
import { Builder, until, WebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';

(async function runTest() {
    let driver: WebDriver | undefined;
    try {
        // Set up Chrome options for headless execution.
        const options = new chrome.Options();
        options.addArguments('headless');       // Run Chrome in headless mode.
        options.addArguments('disable-gpu');      // Disable hardware acceleration.
        // Optionally, add more arguments if needed:
        // options.addArguments('no-sandbox');

        // Build the WebDriver instance using the Selenium server.
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .usingServer('http://selenium:4444/wd/hub')
            .build();

        // Visit the desired URL.
        await driver.get('https://example.com');

        // Wait until the title contains "Example Domain".
        await driver.wait(until.titleContains('Example Domain'), 10000);
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
