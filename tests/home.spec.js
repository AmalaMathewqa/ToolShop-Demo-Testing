const { test, expect } = require('@playwright/test');
const Homepage = require('../page-objects/Homepage');
const applicationData = require('../test-data/application.json');
const { takeScreenshot } = require('../utils/screenshot');

test.afterEach(async ({ page }, testInfo) => {
  await takeScreenshot(page, `${testInfo.project.name}-${testInfo.title}`, testInfo);
});


test('Open the homepage', async ({ page }) => {
  const homepage = new Homepage(page);

  await homepage.open();
  await expect(page).toHaveURL(/practicesoftwaretesting\.com/);
  await expect(page).toHaveTitle(applicationData.title);
});

test('filters products by sustainability', async ({ page }) => {
  const homepage = new Homepage(page);

  await homepage.open();
  await homepage.enableEcoFilter();
  await expect(homepage.ecoFilter).toBeChecked();

  await expect.poll(async () => {
    const productCount = await homepage.products.count();
    const ecoProductCount = await homepage.products.locator('[data-test="eco-badge"]').count();
    return productCount > 0 && productCount === ecoProductCount;
  }).toBe(true);
});

test('comparison page for a selected product', async ({ page }) => {
  const homepage = new Homepage(page);

  await homepage.open();
  await homepage.selectFirstProductForComparison();

  await expect(homepage.compareButtons.first()).toHaveAttribute('aria-pressed', 'true');
  await expect(homepage.compareNowLink).toBeVisible();
  await expect(homepage.selectedProductsMessage).toBeVisible();

  await homepage.openComparison();

  //- $ means the URL must end with that text.
  
  await expect(page).toHaveURL(/\/comparison$/);

  await homepage.clearComparison();
  await expect(homepage.noComparisonProductsMessage).toContainText(applicationData.comparison.noProductsMessage);


});
