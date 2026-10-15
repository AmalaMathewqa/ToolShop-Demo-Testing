const { test, expect } = require('@playwright/test');
const Contactpage = require('../page-objects/Contactpage');
const contactData = require('../test-data/contact.json');
const { takeScreenshot } = require('../utils/screenshot');

test.afterEach(async ({ page }, testInfo) => {
    await takeScreenshot(page, `${testInfo.project.name}-${testInfo.title}`, testInfo);
});

test('submits the contact us form successfully', async ({ page }) => {
    const contactPage = new Contactpage(page);

    await contactPage.open();
    await expect(contactPage.submitButton).toBeVisible();
    await contactPage.submitForm(contactData);

    await expect(contactPage.confirmation).toBeVisible();
    await expect(contactPage.confirmation).toHaveText(/\S+/);
    await expect(contactPage.form).toHaveCount(0);
});
