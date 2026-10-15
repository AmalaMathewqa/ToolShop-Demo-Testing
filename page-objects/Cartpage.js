class Cartpage {
    constructor(page) {
        this.page = page;
        this.productCards = page.locator('a[data-test^="product-"]');
        this.productNames = page.locator('[data-test="product-name"]');
        this.addToCartButton = page.locator('[data-test="add-to-cart"]');
        this.headerCart = page.locator('[data-test="nav-cart"]');
        this.cartQuantity = page.locator('[data-test="cart-quantity"]');
        this.cartProductTitles = page.locator('[data-test="product-title"]');
        this.cartRows = page.locator('table tbody tr');
        this.productQuantity = page.locator('[data-test="product-quantity"]');
        this.linePrice = page.locator('[data-test="line-price"]');
        this.cartTotal = page.locator('[data-test="cart-total"]');
        this.emptyCartMessage = page.getByText(/cart is empty/i);
    }

    async openHome() {
        await this.page.goto('/');
        await this.productCards.first().waitFor();
    }

    async openProduct(productName) {
        await this.productCards.filter({ hasText: productName }).first().click();
    }

    async addProductToCart() {
        await this.addToCartButton.click();
        await this.headerCart.waitFor({ state: 'attached' });
    }

    async openCart() {
        await this.headerCart.waitFor({ state: 'attached' });
        await this.headerCart.click({ force: true });
    }

    getCartProduct(productName) {
        return this.cartProductTitles.filter({ hasText: productName });
    }

    async changeProductQuantity(quantity) {
        await this.productQuantity.fill(String(quantity));
        await this.productQuantity.press('Tab');
    }

    async getLineTotal() {
        return this.readCurrency(this.linePrice);
    }

    async getCartTotal() {
        return this.readCurrency(this.cartTotal);
    }

    async removeProduct(productName) {
        const productRow = this.cartRows.filter({ hasText: productName });
        await productRow.locator('a.btn-danger').click();
    }

}

module.exports = Cartpage;