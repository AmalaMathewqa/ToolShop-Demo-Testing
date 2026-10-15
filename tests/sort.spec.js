const { test, expect } = require('@playwright/test');
const { Sortmodule } = require('../page-objects/Sortmodule');
const sortOptions = require('../test-data/application.json').sortOptions;
const { takeScreenshot } = require('../utils/screenshot');

test.afterEach(async ({ page }, testInfo) => {
  await takeScreenshot(page, `${testInfo.project.name}-${testInfo.title}`, testInfo);
});


for (const option of sortOptions) {
  test(`sort by ${option.value}`, async ({ page }) => {
    const home = new Sortmodule(page);

    await home.goto();
    await home.sortBy(option.value);

    if (option.type === 'name') {
      const names = (await home.getNames()).map((name) => name.trim().toLowerCase());
      const expected = [...names].sort();
      if (option.order === 'desc') expected.reverse();
      expect(names).toEqual(expected);
    } else {
      const prices = await home.getPrices();
      const expected = [...prices].sort((a, b) => a - b);
      if (option.order === 'desc') expected.reverse();
      expect(prices).toEqual(expected);
    }
  });

}