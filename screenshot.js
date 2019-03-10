const puppeteer = require('puppeteer-core');
// const devices = require('puppeteer-core/DeviceDescriptors');
// const iPhone = devices['iPhone X'];
(async () => {
    const browser = await puppeteer.launch({
        executablePath: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
        defaultViewport: {
            width: 1920,
            height:1080
        }
        // headless:false
    });
    const page = await browser.newPage();
    // await page.emulate(iPhone);
    await page.goto('https://www.daikuan.com');
    await page.screenshot({path: 'daikuan.png'});
    await browser.close();
})();
