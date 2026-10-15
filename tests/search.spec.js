

const {test,expect} = require('@playwright/test');
const Searchpage = require('../page-objects/Searchpage');
const applicationData = require('../test-data/application.json');
const { takeScreenshot } = require('../utils/screenshot');

test.afterEach(async ({ page }, testInfo) => {
    await takeScreenshot(page, `${testInfo.project.name}-${testInfo.title}`, testInfo);
});



test('Open the homepage', async ({page}) => {


    await page.goto('/');
    await expect(page).toHaveURL(/practicesoftwaretesting\.com/);
    await expect(page).toHaveTitle(applicationData.title);
  

});



test('Search product', async ({ page }) => {
    const searchPage = new Searchpage(page);

    await searchPage.open();
    await searchPage.searchProducts(applicationData.products.search);

    const products = await searchPage.productNames.allTextContents();
    expect(products.length).toBeGreaterThan(0);
    for (const product of products) {
        expect(product.trim().toLowerCase()).toContain(applicationData.products.search.toLowerCase());
    }
});



test('Clear product search', async ({ page }) => {
    const searchPage = new Searchpage(page);

    await searchPage.open();
    await searchPage.searchProducts(applicationData.products.search);
    await searchPage.clearSearch();

    await expect(searchPage.searchfield).toHaveValue('');
    await expect(searchPage.productNames.first()).toHaveText(applicationData.products.defaultAfterReset);
});
