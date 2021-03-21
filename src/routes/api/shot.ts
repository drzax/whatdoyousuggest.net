import { getScreenshot } from "./_chromium";
import Jimp from "jimp";
const isDev = !process.env.AWS_REGION;
export const get = async ({ query }) => {
  const ttl = 86400;
  try {
    const config = {
      fileType: "png",
      selector: "body",
      ttl,
      ...query,
      isDev,
    };
    const file = await getScreenshot(config);
    const contained = await Jimp.read(file).then((img) => {
      return img
        .background(0xffffffff)
        .contain(1200, 600)
        .getBufferAsync(Jimp.MIME_PNG);
    });
    return {
      statusCode: 200,
      headers: {
        "Content-Type": `image/${config.fileType}`,
      },
      body: contained,
    };

    // res.setHeader("Content-Type", `image/${config.fileType}`);
    // res.setHeader(
    //   "Cache-Control",
    //   `public, s-maxage=${+config.ttl || ttl}, max-age=${+config.ttl || ttl}`
    // );
    // res.end(contained);
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      headers: { "Content-Type": "text/html" },
      body: `<h1>Internal Error</h1><p>There was a problem:</p><p>${e.message}</p>`,
    };
  }
};
