const { test, expect } = require('@playwright/test');
const Homepage = require('../page-objects/PriceFilterpage');
const applicationData = require('../test-data/application.json');
const { takeScreenshot } = require('../utils/screenshot');

test.afterEach(async ({ page }, testInfo) => {
  await takeScreenshot(page, `${testInfo.project.name}-${testInfo.title}`, testInfo);
});
test('displays only products within the selected price range', async ({ page }) => {
  test.setTimeout(120000);
  const homepage = new Homepage(page);

  await page.goto('/');

  await homepage.setPriceRange(applicationData.priceRange.minimum, applicationData.priceRange.maximum);

  await expect.poll(async () => {
    const displayedPrices = await homepage.getDisplayedPrices();
    return displayedPrices.length > 0
      && displayedPrices.every((price) =>
        price >= applicationData.priceRange.minimum
        && price <= applicationData.priceRange.maximum
      );
  }).toBe(true);
});
