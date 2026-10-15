const { test, expect } = require('@playwright/test');
const Registrationpage = require('../page-objects/Registrationpage');
const MyAccountpage = require('../page-objects/MyAccountpage');
const registrationData = require('../test-data/registration.json');
const { takeScreenshot } = require('../utils/screenshot');

test.afterEach(async ({ page }, testInfo) => {
    await takeScreenshot(page, `${testInfo.project.name}-${testInfo.title}`, testInfo);
});
test('registers a new customer account', async ({ page }) => {
    const registrationPage = new Registrationpage(page);
    const customer = {
        ...registrationData,
        email: registrationData.email.replace('@', `.${Date.now()}@`)
    };
    console.log(`New login credentials - Email: ${customer.email}, Password: ${customer.password}`);

    await registrationPage.open();
    await expect(registrationPage.registerButton).toBeVisible();
    await expect(registrationPage.registerButton).toBeEnabled();
    await registrationPage.register(customer);

    await expect(page).toHaveURL(/\/auth\/login$/);
    await expect(registrationPage.registerError).toHaveCount(0);

    const myAccountPage = new MyAccountpage(page);
    await myAccountPage.signIn(customer);
    await expect(page).toHaveURL(/\/account(?:\/overview)?$/);
});
