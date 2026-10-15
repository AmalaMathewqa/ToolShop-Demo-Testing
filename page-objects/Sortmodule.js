
class Sortmodule {
    constructor(page) {
    this.page = page;
    this.sortDropdown = page.locator('[data-test="sort"]');
    this.productNames = page.locator('[data-test="product-name"]');
    this.productPrices = page.locator('[data-test="product-price"]');
   
  }

  async goto() {
    await this.page.goto('/');
  }

  async sortBy(option) {
    await this.sortDropdown.selectOption(option);
    await this.productNames.first().waitFor();
    await this.productPrices.first().waitFor();
    await this.page.waitForTimeout(1000);
  }

  async getNames() {
    return this.productNames.allTextContents();
  }

  async getPrices() {
    const prices = await this.productPrices.allTextContents();
    return prices.map((price) => Number.parseFloat(price.replace(/[^0-9.-]+/g, '')));
  }

  
}

module.exports = { Sortmodule };