const { test, expect } = require('@playwright/test');
const Cartpage = require('../page-objects/Cartpage');
const applicationData = require('../test-data/application.json');
const { takeScreenshot } = require('../utils/screenshot');

test.afterEach(async ({ page }, testInfo) => {
    await takeScreenshot(page, `${testInfo.project.name}-${testInfo.title}`, testInfo);
});
test('adds an in-stock product and blocks an out-of-stock product', async ({ page }) => {
    const cartPage = new Cartpage(page);

    await cartPage.openHome();
    await cartPage.openProduct(applicationData.products.available);
    await cartPage.addProductToCart();

    await cartPage.openHome();
    await cartPage.openProduct(applicationData.products.unavailable);
    await expect(cartPage.addToCartButton).toBeDisabled();

    await cartPage.openCart();

    await expect(page).toHaveURL(/\/checkout$/);
    await expect(cartPage.getCartProduct(applicationData.products.available)).toHaveCount(1);
    await expect(cartPage.headerCart).toContainText(applicationData.cart.singleItemQuantity);
    await expect(cartPage.cartQuantity).toHaveText(applicationData.cart.singleItemQuantity);
});



test('removes a product and updates the cart correctly', async ({ page }) => {
    const cartPage = new Cartpage(page);

    await cartPage.openHome();
    await cartPage.openProduct(applicationData.products.available);
    await cartPage.addProductToCart();
    await cartPage.openCart();
    await expect(page).toHaveURL(/\/checkout$/);
    await expect(cartPage.getCartProduct(applicationData.products.available)).toHaveCount(1);

    await cartPage.removeProduct(applicationData.products.available);
    await expect(cartPage.cartProductTitles).toHaveCount(0);
    await expect(cartPage.emptyCartMessage).toBeVisible();
});
