
class Searchpage {

    constructor(page) {
        this.page = page;

        this.searchfield = page.locator('[data-test="search-query"]');
        this.searchbutton = page.locator('[data-test="search-submit"]');
        this.searchclosebutton = page.locator('[data-test="search-reset"]');
        this.productNames = page.locator('[data-test="product-name"]');
    }

    async open() {
        await this.page.goto('/');
    }

    async searchProducts(searchTerm) {
        await this.searchfield.fill(searchTerm);
        await this.searchbutton.click();
        await this.page.waitForLoadState('networkidle');
        await this.productNames.first().waitFor();
    }

    async clearSearch() {
        await this.searchclosebutton.click();
        await this.searchfield.waitFor();
    }
}

module.exports = Searchpage;
