const puppeteer = require('puppeteer');
const http = require('http');
const log4js = require('log4js');
const cheerio = require('cheerio');
const fs = require('fs');

log4js.configure({
	appenders: { cheese: { type: 'file', filename: 'log.scarpy.txt' } },
	categories: { default: { appenders: ['cheese'], level: 'debug' } }
});

const logger = log4js.getLogger('cheese');

async function Ctrip(proxy) {
	args = ['--no-sandbox', '--ignore-certificate-errors']
	//args.push(`--proxy-server=${proxy.ip}:${proxy.port}`)

	const browser = await puppeteer.launch({ executablePath: 'chrome.exe', 'headless': false, ignoreHTTPSErrors: true, defaultViewport: { width: 1028, height: 800 }, 'args': args, });
	const page = await browser.newPage();

	await page.goto('https://kyfw.12306.cn/otn/resources/login.html', { waitUntil: 'networkidle2' }).catch(ex => {
		logger.error('browser goto main failed. now retry...', ex, "\ncatch end\n");
	});

	await page.waitForSelector('body > div.login-panel > div.login-box > ul > li.login-hd-account > a').then(item => {
		item.click();
	}).catch(ex => {
		console.log(ex);
	});

	var cnt = 0;
	while (true) {
		cnt++;
		await page.waitFor(2 * 1000);

		let obj = await page.waitForSelector('#J-loginImgArea').catch(ex => {
			console.log(ex);
			succeed = false;
		});
		if (obj) {			//293*190
			const bottomBox = await obj.boundingBox();
			//console.log('ok11', obj, bottomPos);

			await obj.screenshot({ path: `12306.${cnt}.png` });

			//console.log(bottomBox);

			await page.waitFor(10 * 1000);

			page.mouse.click(bottomBox.x + bottomBox.width - 50, bottomBox.y + 20);

			console.log('ok02');
		}
		console.log('ok03', cnt);

		if (cnt > 10) {
			break;
		}
	}

	await page.waitFor(60 * 1000);

	console.log('ok04');

	await browser.close();
}

var address = {
	ip: "58.218.200.226",
	port: 7867,
	expire_time: "2019-09-26 11:42:30",
	outip: "124.239.63.22"
};

function CtripWithFetchProxy() {
	const proxyFileName = `proxy.txt`;
	const proxyurl = 'http://http.tiqu.alicdns.com/getip3?num=1&type=2&pro=&city=0&yys=0&port=1&pack=62528&ts=1&ys=0&cs=0&lb=1&sb=0&pb=4&mr=1&regions=';

	address = undefined;
	if (fs.existsSync(proxyFileName)) {
		var fileContext = fs.readFileSync(proxyFileName);
		var curtime = new Date();
		address = JSON.parse(fileContext);

		var expire_time = new Date(address.expire_time);
		if (expire_time.getTime() < (curtime.getTime() + 30)) {
			address = undefined;
		}
	}

	if (address) {
		Ctrip(address);
	} else {
		var resJson = '';
		var req = http.request(proxyurl, function (res) {
			res.setEncoding('utf-8');
			res.on('data', function (proxychunk) {
				resJson = resJson + proxychunk;
			});
			res.on('end', function () {
				if (res.statusCode == 200) {
					logger.info('fetch proxy', proxyurl, '=>', resJson);

					result = JSON.parse(resJson);
					if (result.data.length > 0) {
						address = result.data[0];

						fs.writeFile(proxyFileName, JSON.stringify(address, null, 4), function (error) {
							if (error) {
								logger.info('写入失败', proxyFileName);
							}
						});

						Ctrip(address);
					} else {
						Ctrip(address);
					}
				}
			});
		});

		req.on('error', function (e) {
			logger.error('CtripWithFetchProxy', e);
		});
		req.end();
	}
}

CtripWithFetchProxy();

process.on('uncaughtException', function (err) {
	logger.error('uncaughtException=[\t', err, '\n', err.stack, ']');
});


