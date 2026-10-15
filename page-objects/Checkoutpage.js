class Checkoutpage {
    constructor(page) {
        this.page = page;

        this.cartProductTitle = page.locator('[data-test="product-title"]');
        this.proceedFromCartButton = page.locator('[data-test="proceed-1"]');
        this.customerEmail = page.locator('[data-test="email"]');
        this.customerPassword = page.locator('[data-test="password"]');
        this.loginSubmitButton = page.locator('[data-test="login-submit"]');
        this.proceedAsCustomerButton = page.locator('[data-test="proceed-2"]');
        this.guestTab = page.locator('a[href="#guest-tab"]');
        this.guestEmail = page.locator('[data-test="guest-email"]');
        this.guestFirstName = page.locator('[data-test="guest-first-name"]');
        this.guestLastName = page.locator('[data-test="guest-last-name"]');
        this.guestSubmitButton = page.locator('[data-test="guest-submit"]');
        this.proceedAsGuestButton = page.locator('[data-test="proceed-2-guest"]');

        this.country = page.locator('[data-test="country"]');
        this.postalCode = page.locator('[data-test="postal_code"]');
        this.houseNumber = page.locator('[data-test="house_number"]');
        this.street = page.locator('[data-test="street"]');
        this.city = page.locator('[data-test="city"]');
        this.state = page.locator('[data-test="state"]');
        this.proceedFromAddressButton = page.locator('[data-test="proceed-3"]');

        this.paymentMethod = page.locator('[data-test="payment-method"]');
        this.creditCardNumber = page.locator('[data-test="credit_card_number"]');
        this.expirationDate = page.locator('[data-test="expiration_date"]');
        this.cvv = page.locator('[data-test="cvv"]');
        this.cardHolderName = page.locator('[data-test="card_holder_name"]');
        this.finishButton = page.locator('[data-test="finish"]');
        this.paymentSuccessMessage = page.locator('[data-test="payment-success-message"]');
        this.orderConfirmation = page.locator('#order-confirmation');
    }

    async startCheckout() {
        await this.proceedFromCartButton.click();
    }

    async continueAsRegisteredCustomer(customer) {
        await this.customerEmail.fill(customer.email);
        await this.customerPassword.fill(customer.password);
        await this.loginSubmitButton.click();

        await this.proceedAsCustomerButton.click();
    }

    async continueAsGuest(guest) {
        await this.guestTab.click();
        await this.guestEmail.fill(guest.email);
        await this.guestFirstName.fill(guest.firstName);
        await this.guestLastName.fill(guest.lastName);
        await this.guestSubmitButton.click();

        await this.proceedAsGuestButton.click();
    }

    async enterBillingAddress(address) {
        await this.country.selectOption(address.country);
        await this.postalCode.fill(address.postalCode);

        await this.street.waitFor({ state: 'visible' });
        await this.city.waitFor({ state: 'visible' });
        await this.state.waitFor({ state: 'visible' });
        await this.street.fill(address.street);
        await this.city.fill(address.city);
        await this.state.fill(address.state);

        this.billingAddress = {
            ...address,
            street: await this.street.inputValue(),
            city: await this.city.inputValue(),
            state: await this.state.inputValue()
        };

        await this.houseNumber.fill(address.houseNumber);
        await this.houseNumber.press('Tab');
        await this.page.waitForFunction(
            () => !document.querySelector('[data-test="proceed-3"]')?.disabled,
            { timeout: 30000 }
        );
        await this.proceedFromAddressButton.click();
    }

    async completeCreditCardPayment(payment) {
        await this.paymentMethod.selectOption(payment.method);
        await this.creditCardNumber.fill(payment.cardNumber);
        await this.expirationDate.fill(payment.expirationDate);
        await this.cvv.fill(payment.cvv);
        await this.cardHolderName.fill(payment.cardHolderName);

        await this.finishButton.click();
        await this.paymentSuccessMessage.waitFor({ state: 'visible', timeout: 30000 });

        const invoiceResponsePromise = this.page.waitForResponse(
            (response) =>
                response.request().method() === 'POST' &&
                response.url().includes('/invoices'),
            { timeout: 30000 }
        );

        await this.finishButton.click();
        const invoiceResponse = await invoiceResponsePromise;

        if (!invoiceResponse.ok()) {
            throw new Error(`Invoice creation failed: ${invoiceResponse.status()}`);
       }

        await this.orderConfirmation.waitFor({ state: 'visible', timeout: 30000 });
        const confirmationText = await this.orderConfirmation.innerText();
        const invoiceNumber = confirmationText.match(/invoice number is\s+([A-Za-z0-9-]+)/i)?.[1];

        return invoiceNumber;
    }

    async fillCreditCardPayment(payment) {
        await this.paymentMethod.selectOption(payment.method);
        await this.creditCardNumber.fill(payment.cardNumber);
        await this.expirationDate.fill(payment.expirationDate);
        await this.cvv.fill(payment.cvv);
        await this.cardHolderName.fill(payment.cardHolderName);

    }
}

module.exports = Checkoutpage;