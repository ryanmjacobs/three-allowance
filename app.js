#!/usr/bin/env node

const os = require("os");
const {Client} = require("pg");
const puppeteer = require("puppeteer");

async function scrape() {
  console.log("Launching browser...");
  const browser = await puppeteer.launch();

  console.log("Opening page...");
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 1800 })
  await page.goto("https://www.three.co.uk/My3Account2018/My3Login");

  console.log("Signing in...");
  await page.click("#my3_login_form > label > span > input");
  await page.keyboard.type(process.env.THREE_ID);
  await page.click("#my3_login_form > div.magicpassword > label:nth-child(1) > input");
  await page.keyboard.type(process.env.THREE_PASSWORD);
  await page.click("#my3-login-submit");

  console.log("Navigating to balance page...");
  await page.waitForNavigation();
  await page.goto("https://www.three.co.uk/New_My3/Data_allowance?id=My3_DataAllowanceHeading");

  console.log("Scraping balance...");
  const remaining_data_mb = await page.evaluate(
    sel => parseInt(document.querySelector(sel).innerHTML),
    "#pl-top > div.threePortlet.P30_id.P30_checkMyBalance_w2 > table > tbody:nth-child(3) > tr > td.alignRight");

  console.log("Inserting into Postgres...");
  console.log({remaining_data_mb});
  await insert_pg(remaining_data_mb);

  console.log("Closing browser...");
  await browser.close()
}

async function insert_pg(remaining_data_mb) {
  const client = new Client()
  await client.connect()

  const host = `${os.userInfo().username}@${os.hostname()}`;
  const res = await client.query(
    "INSERT INTO acpi_log (host, cmd, content) VALUES ($1, $2, $3)",
    [host, "three.co.uk remaining data balance", {remaining_data_mb}]
  );

  await client.end()
}

scrape().then(process.exit);
