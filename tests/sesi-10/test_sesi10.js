import { Builder, By, until } from 'selenium-webdriver';
import assert from 'assert';
import chrome from 'selenium-webdriver/chrome.js';

describe('SauceDemo Test Suite', function () {
    let driver;

    // Hook: beforeEach akan dijalankan sebelum setiap test case di dalam suite
    beforeEach(async function () {
        let options = new chrome.Options();
        options.addArguments('--incognito');

        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

        // Action Login
        await driver.get('https://www.saucedemo.com');
        await driver.findElement(By.css('[data-test="username"]')).sendKeys('standard_user');
        await driver.findElement(By.xpath('//*[@data-test="password"]')).sendKeys('secret_sauce');
        await driver.findElement(By.className('submit-button btn_action')).click();
    });

    // Hook: afterEach akan dijalankan setelah setiap test case selesai
    afterEach(async function () {
        if (driver) {
            await driver.quit();
        }
    });

    // Test Case 1: Berhasil login dan memvalidasi elemen-elemen di home page
    it('Harus berhasil login dan memvalidasi elemen keranjang belanja dan judul halaman', async function () {
        let buttonCart = await driver.wait(
            until.elementLocated(By.xpath('//*[@data-test="shopping-cart-link"]')),
            10000 
        );
        await driver.wait(until.elementIsVisible(buttonCart), 5000, 'Shopping cart harus tampil');

        await buttonCart.isDisplayed();

        let textAppLogo = await driver.findElement(By.className('app_logo'));
        let logotext = await textAppLogo.getText();
        assert.strictEqual(logotext, 'Swag Labs');
    });

    // Test Case 2: Mengurutkan produk dari A-Z dan memvalidasi urutannya
    it('Harus mengurutkan produk dari A-Z dan memvalidasi urutannya', async function () {
        let productNamesBeforeSort = await driver.findElements(By.className('inventory_item_name'));
        let namesBefore = await Promise.all(productNamesBeforeSort.map(async (element) => {
            return await element.getText();
        }));

        let dropdown = await driver.findElement(By.className('product_sort_container'));
        await dropdown.findElement(By.xpath('//option[@value="az"]')).click();

        await driver.sleep(1000); 

        let productNamesAfterSort = await driver.findElements(By.className('inventory_item_name'));
        let namesAfter = await Promise.all(productNamesAfterSort.map(async (element) => {
            return await element.getText();
        }));

        let expectedSortedNames = [...namesBefore].sort();

        assert.deepStrictEqual(namesAfter, expectedSortedNames);

        console.log("Pengurutan produk berhasil!");
    });
});
