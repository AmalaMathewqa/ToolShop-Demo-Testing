
class PriceFilterPage {

    constructor(page) {
        this.page = page;

           
        this.priceRange = page.locator('ngx-slider');
        this.minimumPriceHandle = this.priceRange.getByRole('slider', { name: 'ngx-slider', exact: true });
        this.maximumPriceHandle = this.priceRange.getByRole('slider', { name: 'ngx-slider-max', exact: true });
        this.productPrices = page.locator('[data-test="product-price"]');
    }



    //I created a reusable function to move the price slider. It checks the current value, decides which arrow key to press, and moves the slider to the target value. I use the same function for both minimum and maximum prices to avoid repeating code


    async moveSlider(handle, target) {
        const current = Number(await handle.getAttribute('aria-valuenow'));
        const key = target >= current ? 'ArrowRight' : 'ArrowLeft';

        for (let value = 0; value < Math.abs(target - current); value++) {
            await handle.press(key);
        }
    }


    //Home → Minimum value;  End → Maximum value


    async setPriceRange(minimum, maximum) {
    await this.minimumPriceHandle.focus();
    await this.minimumPriceHandle.press('Home');

    for (let i = 0; i < minimum; i++) {
        await this.minimumPriceHandle.press('ArrowRight');
    }

    await this.maximumPriceHandle.focus();
    await this.maximumPriceHandle.press('End');

    for (let i = 100; i > maximum; i--) {
        await this.maximumPriceHandle.press('ArrowLeft');
    }
}

    async getDisplayedPrices() {
        await this.productPrices.first().waitFor();
        const prices = await this.productPrices.allTextContents();
        return prices.map((price) => Number.parseFloat(price.replace(/[^0-9.-]+/g, '')));
    }

}

module.exports = PriceFilterPage;