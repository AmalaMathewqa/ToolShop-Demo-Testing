
class PriceFilterPage {

    constructor(page) {
        this.page = page;

           
        this.priceRange = page.locator('ngx-slider');
        this.minimumPriceHandle = this.priceRange.getByRole('slider', { name: 'ngx-slider', exact: true });
        this.maximumPriceHandle = this.priceRange.getByRole('slider', { name: 'ngx-slider-max', exact: true });
        this.productPrices = page.locator('[data-test="product-price"]');
    }

    async setPriceRange(minimum, maximum) {
        await this.minimumPriceHandle.focus();
        const currentMinimum = Number(await this.minimumPriceHandle.getAttribute('aria-valuenow'));
        const minimumKey = minimum >= currentMinimum ? 'ArrowRight' : 'ArrowLeft';
        for (let value = 0; value < Math.abs(minimum - currentMinimum); value++) {
            await this.minimumPriceHandle.press(minimumKey);
            await this.page.waitForTimeout(10);
        }

        await this.maximumPriceHandle.focus();
        const currentMaximum = Number(await this.maximumPriceHandle.getAttribute('aria-valuenow'));
        const maximumKey = maximum >= currentMaximum ? 'ArrowRight' : 'ArrowLeft';
        for (let value = 0; value < Math.abs(maximum - currentMaximum); value++) {
            await this.maximumPriceHandle.press(maximumKey);
            await this.page.waitForTimeout(10);
        }
    }

    async getDisplayedPrices() {
        await this.productPrices.first().waitFor();
        const prices = await this.productPrices.allTextContents();
        return prices.map((price) => Number.parseFloat(price.replace(/[^0-9.-]+/g, '')));
    }

}

module.exports = PriceFilterPage;