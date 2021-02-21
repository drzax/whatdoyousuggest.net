import got from "got";
import { parse } from "node-html-parser";
import { getLangByLocation } from "$lib/utils";
import type { LocationName } from "$lib/constants";

export const get = async ({ query }) => {
  const qry: string = query.get("q");
  const l: LocationName = query.get("l");
  const res = await got("https://www.bing.com/AS/Suggestions", {
    responseType: "text",
    searchParams: { cvid: "a", qry, mkt: `${getLangByLocation(l)}-${l}` },
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