const puppeteer = require('puppeteer-core');
(async () => {
    const browser = await puppeteer.launch({
        executablePath: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
        defaultViewport: {
            width: 1920,
            height:1080
        }
    });
    const page = await browser.newPage();
    await page.goto('https://www.baidu.com');
    await page.pdf({path: 'baidu.pdf', format: 'A4'});
    await browser.close();
})();
