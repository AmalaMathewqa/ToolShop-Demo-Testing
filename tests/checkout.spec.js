const { test, expect } = require('@playwright/test');
const Cartpage = require('../page-objects/Cartpage');
const Checkoutpage = require('../page-objects/Checkoutpage');
const MyAccountpage = require('../page-objects/MyAccountpage');
const checkoutData = require('../test-data/checkout.json');
const loginData = require('../test-data/login.json');
const { takeScreenshot } = require('../utils/screenshot');

test.afterEach(async ({ page }, testInfo) => {
    await takeScreenshot(page, `${testInfo.project.name}-${testInfo.title}`, testInfo);
});

async function prepareCheckout(page) {
    const cartPage = new Cartpage(page);
    const checkoutPage = new Checkoutpage(page);

    await cartPage.openHome();
    await cartPage.openProduct(checkoutData.product.name);
    await cartPage.addProductToCart();
    await cartPage.openCart();

    await expect(page).toHaveURL(/\/checkout$/);
    await expect(checkoutPage.cartProductTitle).toContainText(checkoutData.product.name);
    await checkoutPage.startCheckout();
    await expect(checkoutPage.customerEmail).toBeVisible();
    await checkoutPage.continueAsRegisteredCustomer(loginData);
    await expect(checkoutPage.country).toBeVisible();
    await checkoutPage.enterBillingAddress(checkoutData.billingAddress);
    await expect(checkoutPage.paymentMethod).toBeVisible();

    return { checkoutPage, customer: loginData };
}

test('rejects a failed credit card payment', async ({ page }) => {
    const { checkoutPage } = await prepareCheckout(page);

    await checkoutPage.fillCreditCardPayment(checkoutData.failedPayment);
    await expect(checkoutPage.finishButton).toBeDisabled();
});

test('completes checkout and verifies its invoice in My Account', async ({ page }) => {
    const { checkoutPage, customer } = await prepareCheckout(page);

    const invoiceNumber = await checkoutPage.completeCreditCardPayment(checkoutData.payment);
    const myAccountPage = new MyAccountpage(page);

    await myAccountPage.signIn(customer);
    await expect(page).toHaveURL(/\/account(?:\/overview)?$/);
    await myAccountPage.openInvoices();
    await expect(myAccountPage.invoicePageTitle).toBeVisible();
    await expect(myAccountPage.invoiceRows.filter({ hasText: invoiceNumber })).toHaveCount(1);
    await myAccountPage.openInvoiceByNumber(invoiceNumber);
    await expect(myAccountPage.invoiceNumber).toBeVisible();
    await expect(myAccountPage.invoiceNumber).toHaveValue(invoiceNumber);
    await expect(myAccountPage.invoiceDate).not.toHaveValue('');
    await expect(myAccountPage.productDetails).toContainText(checkoutData.product.name);
    await expect(myAccountPage.billingStreet).not.toHaveValue('');
    await expect(myAccountPage.billingPostalCode).toHaveValue(checkoutPage.billingAddress.postalCode);
    await expect(myAccountPage.billingCity).not.toHaveValue('');
    await expect(myAccountPage.billingState).not.toHaveValue('');
    await expect(myAccountPage.billingCountry).toHaveValue(checkoutPage.billingAddress.country);
    await expect(myAccountPage.paymentMethod).toHaveValue('Credit Card');
    await expect(myAccountPage.creditCardNumber).toHaveValue(checkoutData.payment.cardNumber);
    await expect(myAccountPage.cardHolderName).toHaveValue(checkoutData.payment.cardHolderName);
});