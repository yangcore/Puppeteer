const puppeteer = require('puppeteer-core');
const axios = require('axios');
const fs = require('fs');
const dirName = process.argv[2];
let currentChapter = 197;
(async function run(url) {
    require('events').EventEmitter.defaultMaxListeners = 0;
    const browser = await puppeteer.launch({
        executablePath: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
    });
    const page = await browser.newPage();
    try {
        console.log(`Start to crawl ${dirName}\'s pivtures...`);
        console.log(url, '当前页面链接');
        const res = await page.goto(url, {timeout: 60000, waitUntil: "domcontentloaded"});
        const imgDomain = await page.evaluate("imgDomain");
        const did = await page.evaluate("did");
        const sid = await page.evaluate("sid");
        let pcount = await page.evaluate("pcount");
        let promiseUrlArr = [];
        // 总页数
        const totalPage = await page.evaluate(() => {
            const href = document.querySelectorAll('.mCustomScrollBox ul li:first-child a')[0].href;
            return href.split('/')[href.split('/').length - 1].replace(/.html/g, '');
        });

        function getImageUrl(retry = 3, pcount) {
            return axios.get(`https://www.tohomh123.com/action/play/read?did=${did}&sid=${sid}&iid=${pcount}&tmp=${Math.random()}`).then(res => {
                return res.data.Code;
            }).catch(function (error) {
                retry--;
                if (retry > 0) {
                    getImageUrl(retry, pcount)
                }
            })
        }

        while (pcount > 0) {
            promiseUrlArr.push(getImageUrl(3, pcount));
            pcount--;
        }
        const imgUrlArr = (await Promise.all(promiseUrlArr)).filter(item => {
            if (!(new RegExp("[\\u4E00-\\u9FFF]+", "g").test(item))) {
               return item
            }
        });
        let promiseArr = [];
        imgUrlArr.forEach(item => {
            const imgName = item.split('/')[item.split('/').length - 1];

            function getImage(retry = 3) {
                return axios.get(item, {
                    timeout: 40000,
                    responseType: 'stream'
                }).then(res => {
                    if (!fs.existsSync(`./${dirName}`)) {
                        fs.mkdirSync(`./${dirName}`)
                    }
                    if (!fs.existsSync(`./${dirName}/${currentChapter}`)) {
                        fs.mkdirSync(`./${dirName}/${currentChapter}`)
                    }
                    res.data.pipe(fs.createWriteStream(`./${dirName}/${currentChapter}/${imgName}`));
                }).catch(function (error) {
                    retry--;
                    if (retry > 0) {
                        getImage(retry)
                    } else {
                        console.error(error, `${currentChapter}/${imgName}`);
                    }
                })
            }

            promiseArr.push(getImage())
        });
        await Promise.all(promiseArr).then(async () => {
            await browser.close();
            console.log(`${currentChapter}章全部下载完成`);
            currentChapter++;
            if (currentChapter > totalPage) {
                console.log('全部章节下载完成');
                await browser.close();
                return false
            }
            run(`https://www.tohomh123.com/${dirName}/${currentChapter}.html`)
        });
    } catch (error) {
        console.error(error, '全局抛出错误');
    }
})(`https://www.tohomh123.com/${dirName}/${currentChapter}.html`);
