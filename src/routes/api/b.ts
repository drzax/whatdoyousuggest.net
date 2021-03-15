import fetch from "node-fetch";
import { getLangByLocation, obj2search } from "$lib/utils";

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

  const suggestions = Array.from(
    res.matchAll(/<li[^>]*>(.+?)<\/li>/g)
  ).map((d) => d[1].replace(/<.+?>/g, ""));

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
