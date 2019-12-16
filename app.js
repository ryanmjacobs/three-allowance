#!/usr/bin/env node

const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 1800 })
  await page.goto("https://www.three.co.uk/My3Account2018/My3Login");

  // login
  await page.click("#my3_login_form > label > span > input");
  await page.keyboard.type(process.env.THREE_ID);
  await page.click("#my3_login_form > div.magicpassword > label:nth-child(1) > input");
  await page.keyboard.type(process.env.THREE_PASSWORD);
  await page.click("#my3-login-submit");

  // navigate to balance page
  await page.waitForNavigation();
  await page.goto("https://www.three.co.uk/New_My3/Data_allowance?id=My3_DataAllowanceHeading");

  // grab balance
  const remaining_data = await page.evaluate(
    sel => parseInt(document.querySelector(sel).innerHTML),
    "#pl-top > div.threePortlet.P30_id.P30_checkMyBalance_w2 > table > tbody:nth-child(3) > tr > td.alignRight");

  console.log({remaining_data});

  await browser.close()
})();
