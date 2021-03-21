import chrome from "chrome-aws-lambda";
const exePath =
  process.platform === "win32"
    ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
    : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

export const getOptions = async (isDev: boolean) => {
  return isDev
    ? {
        args: [],
        executablePath: exePath,
        headless: true,
      }
    : {
        args: chrome.args,
        executablePath: await chrome.executablePath,
        headless: chrome.headless,
      };
};
