const applicationData = require('../test-data/application.json');

class Contactpage {
    constructor(page) {
        this.page = page;
        this.firstName = page.locator('[data-test="first-name"]');
        this.lastName = page.locator('[data-test="last-name"]');
        this.email = page.locator('[data-test="email"]');
        this.subject = page.locator('[data-test="subject"]');
        this.message = page.locator('[data-test="message"]');
        this.submitButton = page.locator('[data-test="contact-submit"]');
        this.confirmation = page.locator('[role="alert"].alert-success');
        this.form = page.locator('form');
    }

    async open() {
        await this.page.goto(applicationData.routes.contact);
    }

    async submitForm(contact) {
        await this.firstName.fill(contact.firstName);
        await this.lastName.fill(contact.lastName);
        await this.email.fill(contact.email);
        await this.subject.selectOption({ label: contact.subject });
        await this.message.fill(contact.message);
        await this.submitButton.click();
    }
}

module.exports = Contactpage;
