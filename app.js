#!/usr/bin/env node

const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 1800 })

  await page.goto("https://www.three.co.uk/My3Account2018/My3Login");
  await page.screenshot({ path: 'screenshot.png' });

  await browser.close()
})();
