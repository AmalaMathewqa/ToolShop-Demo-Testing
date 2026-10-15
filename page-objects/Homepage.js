class Homepage {

    constructor(page) {
        this.page = page;
        this.ecoFilter = page.locator('[data-test="eco-friendly-filter"]');
        this.products = page.locator('a[data-test^="product-"]');
        this.productNames = page.locator('[data-test="product-name"]');
        this.ecoBadges = page.locator('[data-test="eco-badge"]');
        this.compareButtons = page.locator('[data-test="compare-btn"]');
        this.compareNowLink = page.getByRole('link', { name: 'Compare Now' });
        this.selectedProductsMessage = page.getByText('1 product(s) selected');
        this.clearAllButton = page.getByRole('button', { name: 'Clear All' });
        this.pageTwoButton = page.getByRole('button', { name: 'Page-2' });
        this.noComparisonProductsMessage = page.getByText(
            require('../test-data/application.json').comparison.noProductsMessage
        );
    }

    async open() {
        await this.page.goto('/');
    }

    async enableEcoFilter() {
        await this.ecoFilter.evaluate((checkbox) => checkbox.click());
    }

    async selectFirstProductForComparison() {
        await this.compareButtons.first().click();
    }

    async openComparison() {
        await this.compareNowLink.click();
    }

    async clearComparison() {
        await this.clearAllButton.click();
    }

    async goToPageTwo() {
        await this.pageTwoButton.click();
    }
}

module.exports = Homepage;
