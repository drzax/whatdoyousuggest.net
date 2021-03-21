import puppeteer from "puppeteer-core";
import { getOptions } from "./_options";
let _page: puppeteer.Page;

async function getPage(isDev: boolean) {
  if (_page) {
    return _page;
  }
  const options = await getOptions(isDev);
  const browser = await puppeteer.launch(options);
  _page = await browser.newPage();
  return _page;
}

export async function getScreenshots({
  url,
  width = 1200,
  isDev,
  fileType,
  selectors,
}: {
  url: string;
  width: number;
  isDev: boolean;
  fileType: string;
  selectors: string[];
}) {
  const viewport = { width: +width, height: 5000, deviceScaleFactor: 2 };
  const page = await getPage(isDev);
  await page.setViewport(viewport);
  await page.goto(url, { waitUntil: "networkidle0" });

  // This little contortion is because a bug in puppeteer prevents element screenshots
  // when the element is outside the viewport. See: https://github.com/puppeteer/puppeteer/issues/2423
  const fullPage = await page.$("body");
  const fullPageSize = await fullPage.boundingBox();
  await page.setViewport({
    ...viewport,
    height: fullPageSize.height,
  });
  const files = await Promise.all(
    selectors.map(async (selector) => {
      const el = await page.$(selector);
      const file = await el.screenshot({ fileType });
      return file;
    })
  );
  return files.filter((f) => f instanceof Buffer) as Buffer[];
}

export async function getScreenshot({
  url,
  width = 1200,
  isDev,
  fileType,
  selector,
}) {
  const arr = await getScreenshots({
    url,
    width,
    isDev,
    fileType,
    selectors: [selector],
  });
  return arr[0];
}
