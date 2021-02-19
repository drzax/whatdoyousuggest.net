import got from "got";
import { parse } from "node-html-parser";

const langs = {
  ar: "es",
  au: "en",
  br: "pt",
  ca: "en",
  cn: "zh",
  fr: "fr",
  de: "de",
  in: "en",
  id: "id",
  it: "it",
  jp: "jp",
  mx: "es",
  ru: "ru",
  sa: "en",
  za: "en",
  kr: "ko",
  tr: "tr",
  gb: "en",
  us: "us",
};

export const get = async ({ query }) => {
  const qry: string = query.get("q");
  const loc: LocationName = query.get("l");
  const res = await got("https://www.bing.com/AS/Suggestions", {
    responseType: "text",
    searchParams: { cvid: "a", qry, mkt: `${langs[loc]}-${loc}` },
  });
  const dom = parse(res.body);
  const suggestions = dom.querySelectorAll(".sa_tm").map((d) => d.text);

  return {
    statusCode: 200,
    headers: {
      // Netlify, doesn't currently use query strings in the cache key: https://community.netlify.com/t/netlify-function-with-query-strings-ignores-custom-cache-control-header/15390/20
      // 'Cache-Control': 'public, max-age=604800, s-maxage=604800',
      "Content-Type": "application/json",
    },
    body: suggestions,
  };
};
