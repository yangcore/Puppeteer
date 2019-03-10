const puppeteer = require('puppeteer-core');
(async () => {
    const browser = await puppeteer.launch({
        executablePath: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
        defaultViewport: {
            width: 1366,
            height: 768
        },
        headless: false
    });
    const page = await browser.newPage();
    await page.goto('https://github.com', {timeout: 60000, waitUntil: "domcontentloaded"});
    await page.click('.HeaderMenu-link.no-underline.mr-3');
    await page.waitFor(2000);
    // await page.evaluate(() => {
    //     document.querySelector('#login_field').value = '943134861@qq.com';
    //     document.querySelector('#password').value = 'yc943134861';
    // });
    await page.type('#login_field', '943134861@qq.com');
    await page.type('#password', 'yc943134861', {delay: 100});
    await page.click('.btn.btn-primary.btn-block');
    await page.waitFor(3000);
    await page.type('.form-control.header-search-input.jump-to-field.js-jump-to-field.js-site-search-focus', 'MPX', {delay: 100});
    await page.keyboard.down('Enter');
    await page.screenshot({path: 'github.png'});
    // await browser.close();
})();
