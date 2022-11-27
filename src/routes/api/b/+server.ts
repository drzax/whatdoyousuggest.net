import { json as json$1 } from '@sveltejs/kit';
import fetch from "node-fetch";
import { decode } from "html-entities";
import { getLangByLocation, obj2search, validateLocation } from "$lib/utils";

import type { LocationName } from "../../../types";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ query }) => {
  const qry: string = encodeURIComponent(query.get("q"));
  const l: LocationName = validateLocation(query.get("l"));
  const res = await fetch(
    "https://www.bing.com/AS/Suggestions?" +
      obj2search({
        cvid: "a",
        qry,
        mkt: `${getLangByLocation(l)}-${l}`,
      })
  ).then((res) => res.text());

  const suggestions = Array.from(res.matchAll(/<li[^>]*>(.+?)<\/li>/g))
    .map((d) => d[1].replace(/<.+?>/g, ""))
    .map((d) => decode(d));

  throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292701)");
  // Suggestion (check for correctness before using):
  // return json$1(suggestions, {
  //   headers: {
  //     // Netlify, doesn't currently use query strings in the cache key: https://community.netlify.com/t/netlify-function-with-query-strings-ignores-custom-cache-control-header/15390/20
  //     // 'Cache-Control': 'public, max-age=604800, s-maxage=604800',
  //     "Content-Type": "application/json",
  //   }
  // });
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
