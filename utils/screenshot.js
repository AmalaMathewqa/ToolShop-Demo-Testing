async function takeScreenshot(page, name, testInfo) {
    if (testInfo.status === testInfo.expectedStatus) {
        return;
    }

    const uniqueName = `${name}-${Date.now()}`;
    const path = `screenshots/${uniqueName}.png`;

    await page.screenshot({
        path,
        fullPage: true
    });

    await testInfo.attach('failure-screenshot', {
        path,
        contentType: 'image/png'
    });
}

module.exports = { takeScreenshot };
