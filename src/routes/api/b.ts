import fetch from "isomorphic-unfetch";
import HTMLParser from "node-html-parser";
import { getLangByLocation, obj2search } from "../../lib/utils";
import type { LocationName } from "../../lib/constants";

export const get = async ({ query }) => {
  const qry: string = query.get("q");
  const l: LocationName = query.get("l");
  const res = await fetch(
    "https://www.bing.com/AS/Suggestions?" +
      obj2search({
        cvid: "a",
        qry,
        mkt: `${getLangByLocation(l)}-${l}`,
      })
  ).then((res) => res.text());
  const dom = HTMLParser(res);

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
