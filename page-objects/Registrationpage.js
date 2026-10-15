const applicationData = require('../test-data/application.json');

class Registrationpage {
    constructor(page) {
        this.page = page;
        this.firstName = page.locator('[data-test="first-name"]');
        this.lastName = page.locator('[data-test="last-name"]');
        this.dateOfBirth = page.locator('[data-test="dob"]');
        this.country = page.locator('[data-test="country"]');
        this.postalCode = page.locator('[data-test="postal_code"]');
        this.houseNumber = page.locator('[data-test="house_number"]');
        this.street = page.locator('[data-test="street"]');
        this.city = page.locator('[data-test="city"]');
        this.state = page.locator('[data-test="state"]');
        this.phone = page.locator('[data-test="phone"]');
        this.email = page.locator('[data-test="email"]');
        this.password = page.locator('[data-test="password"]');
        this.registerButton = page.locator('[data-test="register-submit"]');
        this.registerError = page.locator('[data-test="register-error"]');
    }

    async open() {
        await this.page.goto(applicationData.routes.register);
    }

    async register(customer) {
        await this.firstName.fill(customer.firstName);
        await this.lastName.fill(customer.lastName);
        await this.dateOfBirth.fill(customer.dateOfBirth);
        await this.country.selectOption(customer.country);
        await this.postalCode.fill(customer.postalCode);
        await this.houseNumber.fill(customer.houseNumber);
        await this.street.fill(customer.street);
        await this.city.fill(customer.city);
        await this.state.fill(customer.state);
        await this.phone.fill(customer.phone);
        await this.email.fill(customer.email);
        await this.password.fill(customer.password);
        await this.registerButton.click();
    }
}

module.exports = Registrationpage;
