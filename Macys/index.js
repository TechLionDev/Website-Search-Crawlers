const axios = require("axios")
const cheerio = require("cheerio")
const fs = require('fs');
const clc = require("cli-color");
const path = require('path');
const error = clc.red.bold;
const info = clc.cyan.bold;
const success = clc.green.bold;

const userAgents = [
    'Mozilla/5.0 (iPhone; CPU iPhone OS 8_4_9; like Mac OS X) AppleWebKit/603.33 (KHTML, like Gecko)  Chrome/52.0.2211.318 Mobile Safari/603.3',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 10_1_5; like Mac OS X) AppleWebKit/600.11 (KHTML, like Gecko)  Chrome/53.0.1798.111 Mobile Safari/602.3',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 11_3_5; like Mac OS X) AppleWebKit/533.19 (KHTML, like Gecko)  Chrome/47.0.3405.115 Mobile Safari/600.3',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 8_1_2; like Mac OS X) AppleWebKit/600.19 (KHTML, like Gecko)  Chrome/55.0.2474.286 Mobile Safari/600.3',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 11_1_4; like Mac OS X) AppleWebKit/534.2 (KHTML, like Gecko)  Chrome/55.0.2756.363 Mobile Safari/534.8',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 8_1_1; like Mac OS X) AppleWebKit/536.29 (KHTML, like Gecko)  Chrome/51.0.2499.274 Mobile Safari/601.6',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 8_3_7; like Mac OS X) AppleWebKit/603.13 (KHTML, like Gecko)  Chrome/49.0.1540.369 Mobile Safari/534.5',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 11_7_9; like Mac OS X) AppleWebKit/535.27 (KHTML, like Gecko)  Chrome/47.0.3434.201 Mobile Safari/600.1',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 8_9_5; like Mac OS X) AppleWebKit/537.7 (KHTML, like Gecko)  Chrome/48.0.3471.336 Mobile Safari/535.8',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 8_0_5; like Mac OS X) AppleWebKit/537.37 (KHTML, like Gecko)  Chrome/52.0.3957.289 Mobile Safari/602.7',
    'Mozilla/5.0 (Linux; U; Android 7.1; Nexus 5P Build/NME91E) AppleWebKit/603.40 (KHTML, like Gecko)  Chrome/50.0.3195.222 Mobile Safari/601.4',
    'Mozilla/5.0 (Android; Android 6.0.1; SAMSUNG SM-G9350I Build/MMB29V) AppleWebKit/600.24 (KHTML, like Gecko)  Chrome/50.0.1679.388 Mobile Safari/536.8',
    'Mozilla/5.0 (Linux; Android 5.0; SAMSUNG SM-G925H Build/KOT49H) AppleWebKit/603.39 (KHTML, like Gecko)  Chrome/50.0.3440.391 Mobile Safari/602.2',
    'Mozilla/5.0 (Linux; Android 5.0; SAMSUNG SM-T815 Build/LRX22G) AppleWebKit/537.22 (KHTML, like Gecko)  Chrome/53.0.3656.383 Mobile Safari/601.6',
    'Mozilla/5.0 (Android; Android 4.4.1; [HM NOTE|NOTE-III|NOTE2 1LTETD) AppleWebKit/535.23 (KHTML, like Gecko)  Chrome/52.0.2059.349 Mobile Safari/600.9',
    'Mozilla/5.0 (Linux; Android 5.0.2; HTC [M8|M9|M8 Pro Build/LRX22G) AppleWebKit/602.12 (KHTML, like Gecko)  Chrome/49.0.1346.194 Mobile Safari/601.2',
    'Mozilla/5.0 (Linux; U; Android 5.1.1; SAMSUNG SM-G9350I Build/MMB29M) AppleWebKit/602.11 (KHTML, like Gecko)  Chrome/51.0.1388.230 Mobile Safari/603.0',
    'Mozilla/5.0 (Linux; U; Android 7.0; SAMSUNG GT-I9600 Build/KTU84P) AppleWebKit/533.50 (KHTML, like Gecko)  Chrome/50.0.2340.326 Mobile Safari/536.0',
    'Mozilla/5.0 (Linux; Android 5.1.1; XT1021 Build/LPH223) AppleWebKit/601.9 (KHTML, like Gecko)  Chrome/47.0.1562.162 Mobile Safari/602.2',
    'Mozilla/5.0 (Linux; U; Android 5.1; Nexus 5 Build/LRX22C) AppleWebKit/533.18 (KHTML, like Gecko)  Chrome/48.0.1192.230 Mobile Safari/534.3',
    'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 8_1_3; en-US) AppleWebKit/535.18 (KHTML, like Gecko) Chrome/51.0.3173.135 Safari/535',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_8) Gecko/20100101 Firefox/65.6', 'Mozilla/5.0 (Windows; U; Windows NT 6.0; Win64; x64) AppleWebKit/602.31 (KHTML, like Gecko) Chrome/53.0.1684.108 Safari/601',
    'Mozilla/5.0 (Linux i564 x86_64; en-US) AppleWebKit/603.39 (KHTML, like Gecko) Chrome/52.0.1526.332 Safari/535',
    'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_12_9) Gecko/20100101 Firefox/71.1', 'Mozilla/5.0 (U; Linux x86_64; en-US) Gecko/20130401 Firefox/68.3',
    'Mozilla/5.0 (Linux i563 ) Gecko/20100101 Firefox/66.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 9_3_8; en-US) AppleWebKit/534.49 (KHTML, like Gecko) Chrome/50.0.1622.239 Safari/533',
    'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 9_7_7; en-US) Gecko/20130401 Firefox/56.1', 'Mozilla/5.0 (Linux; Linux i553 ) Gecko/20100101 Firefox/57.2', 'Mozilla/5.0 (Linux; Linux x86_64) Gecko/20130401 Firefox/74.7',
    'Mozilla/5.0 (Windows; Windows NT 10.1; Win64; x64) Gecko/20130401 Firefox/65.0', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_5_8) AppleWebKit/533.23 (KHTML, like Gecko) Chrome/48.0.1997.250 Safari/537',
    'Mozilla / 5.0(compatible; MSIE 9.0; Windows; Windows NT 10.1; x64; en - US Trident / 5.0) ',
    'Mozilla / 5.0(Windows NT 10.5;; en - US) AppleWebKit / 600.12(KHTML, like Gecko) Chrome / 55.0.1770.321 Safari / 534',
    'Mozilla / 5.0(compatible; MSIE 10.0; Windows; Windows NT 6.3; WOW64 Trident / 6.0) ',
    'Mozilla / 5.0(Linux; U; Linux x86_64; en - US) AppleWebKit / 536.32(KHTML, like Gecko) Chrome / 47.0.2496.375 Safari / 602',
    'Mozilla / 5.0(Linux i656 x86_64) AppleWebKit / 533.16(KHTML, like Gecko) Chrome / 51.0.2973.394 Safari / 534',
    'Mozilla / 5.0(U; Linux x86_64; en - US) AppleWebKit / 536.39(KHTML, like Gecko) Chrome / 51.0.3171.157 Safari / 600',
    'Mozilla / 5.0(compatible; MSIE 9.0; Windows; Windows NT 10.3; Win64; x64; en - US Trident / 5.0) '
];

const SEARCH_TERMS = [
    "Women's Dresses",
    "Women's Tops",
    "Women's Jeans",
    "Women's Skirts",
    "Women's Blouses",
    "Women's Sweaters",
    "Women's Suits",
    "Women's Activewear",
    "Women's Coats And Jackets",
    "Women's Socks",
    "Women's Underwear",
    "Women's Bras",
    "Women's Pajamas",
    "Men's Suits",
    "Men's Dress Shirts",
    "Men's Pants",
    "Men's Jeans",
    "Men's Shorts",
    "Men's Sweaters",
    "Men's Coats And Jackets",
    "Men's Socks",
    "Men's Underwear",
    "Men's T-Shirts",
    "Men's Polos",
    "Men's Activewear",
    "Boys' Clothing",
    "Boys' Shirts",
    "Boys' Pants",
    "Boys' Shorts",
    "Boys' Jackets",
    "Boys' Socks",
    "Boys' Underwear",
    "Girls' Clothing",
    "Girls' Dresses",
    "Girls' Tops",
    "Girls' Pants",
    "Girls' Shorts",
    "Girls' Skirts",
    "Girls' Jackets",
    "Girls' Socks",
    "Girls' Underwear",
    "Home Decor",
    "Furniture",
    "Kitchen Appliances",
    "Bedding",
    "Beauty Products",
    "Jewelry",
    "Electronics",
    "Handbags",
    "Shoes",
    "Watches"
]

let products = []
const currentDate = new Date();
const folderName = `products/${currentDate.toLocaleDateString().replaceAll('/', '_')}`;
const folderPath = path.join(__dirname, folderName);
async function main() {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
    for (let SEARCH_TERM of SEARCH_TERMS) {
        await search(SEARCH_TERM)
    }
}

async function search(term) {
    const url = `https://www.macys.com/shop/featured/${term}/Productsperpage,Sortby/120,TOP_RATED`
    try {
        let response = await axios.get(url, {
            'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)]
        })
        let $ = cheerio.load(response.data)
        let totalNumOfPages = $('ul.pagination > li > div.select-container > select > option:last-child').attr('value');
        console.log(success(`(✓) Found ${totalNumOfPages ? totalNumOfPages + ' Pages' : 'One Page'} of results for \"${term}\"\n______________________________________________________\n`))
        if (totalNumOfPages) {
            for (let pageNum = 1; pageNum <= totalNumOfPages; pageNum++) {
                let pageUrl = `https://www.macys.com/shop/featured/${term}/Pageindex,Productsperpage,Sortby/${pageNum},120,TOP_RATED`
                try {
                    console.log(info(`(i) Crawling Page ${pageNum} of ${totalNumOfPages} for \"${term}\"\n`))
                    await crawlPage(pageUrl, pageNum)
                } catch {
                    console.log(error(`(⬣) Failed To Crawl Search Results Page ${pageNum} of ${totalNumOfPages} for \"${term}\"\n`));
                }
            }
        }
        try {
            console.log(info(`(i) Saving ${products.length} Products...\n`))
            const filePath = path.join(folderPath, `${term.replaceAll(" ", "_")}.json`);
            fs.writeFile(filePath, JSON.stringify(products), (err) => {
                if (err) throw err;
            });
            console.log(success(`(✓) Saved ${products.length} Products`))
        } catch {
            console.log(error(`(⬣) Failed To Save Products To JSON File\n`))
        }
    } catch {
        console.log(error(`(⬣) Failed To Search Macy's for the term: \"${term}\"\n`));
    }
}

async function crawlPage(url, page) {
    try {
        let response = await axios.get(url, {
            'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)]
        })
        let $ = cheerio.load(response.data)
        let pageProducts = [];
        let priceRegEx = /\$([\d,]+\.\d{2})/
        $('li.productThumbnailItem').each(function (index, element) {
            let rawRegPriceText = $(element).find('span.regular').text();
            let matchRegPrice = rawRegPriceText.match(priceRegEx)
            let rawDisPriceText = $(element).find('span.discount').text();
            let matchDisPrice = rawDisPriceText.match(priceRegEx)
            let product = {}
            product['index'] = index + 1;
            product['page'] = page;
            product['name'] = $(element).find('a').attr('title').trim();
            product['price'] = matchRegPrice ? matchRegPrice[1] : "No Price Found"
            product['discount'] = matchDisPrice ? matchDisPrice[1] : "No Discount Found"
            product['url'] = 'https://www.macys.com' + $(element).find('a').attr('href');
            product['image'] = $(element).find('picture > img').attr('data-lazysrc');
            pageProducts.push(products)
            products.push(product)
        })
        console.log(success(`(✓) Found ${pageProducts.length} Products On Page ${page}\n______________________________________________________\n`))
    } catch { }
}

main();