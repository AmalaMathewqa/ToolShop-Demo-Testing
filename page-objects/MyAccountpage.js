const applicationData = require('../test-data/application.json');

class MyAccountpage {
    constructor(page) {
        this.page = page;

        this.email = page.locator('[data-test="email"]');
        this.password = page.locator('[data-test="password"]');
        this.loginSubmitButton = page.locator('[data-test="login-submit"]');
        this.invoicePageTitle = page.locator('[data-test="page-title"]');
        this.invoiceRows = page.locator('table tbody tr');
        this.invoiceDetailsLinks = page.locator('table tbody a.btn');

        this.invoiceNumber = page.locator('[data-test="invoice-number"]');
        this.invoiceDate = page.locator('[data-test="invoice-date"]');
        this.billingStreet = page.locator('[data-test="street"]');
        this.billingPostalCode = page.locator('[data-test="postal_code"]');
        this.billingCity = page.locator('[data-test="city"]');
        this.billingState = page.locator('[data-test="state"]');
        this.billingCountry = page.locator('[data-test="country"]');
        this.paymentMethod = page.locator('[data-test="payment-method"]');
        this.creditCardNumber = page.locator('#credit_card_number');
        this.cardHolderName = page.locator('#card_holder_name');
        this.productDetails = page.locator('table tbody');
    }

    async signIn(customer) {
        await this.page.goto(applicationData.routes.login);
        await this.email.fill(customer.email);
        await this.password.fill(customer.password);
        await this.loginSubmitButton.click();
    }

    async openInvoices() {
        await this.page.goto(applicationData.routes.invoices);
    }

    async openInvoiceByNumber(invoiceNumber) {
        const invoiceRow = this.invoiceRows.filter({ hasText: invoiceNumber });
        await invoiceRow.getByRole('link').click();
    }
}

module.exports = MyAccountpage;