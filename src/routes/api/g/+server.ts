import { json as json$1 } from '@sveltejs/kit';
import fetch from "node-fetch";
import { parse } from "content-type";
import { obj2search, validateLocation } from "$lib/utils";

import type { LocationName } from "../../../types";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ query }) => {
  const q: string = encodeURIComponent(query.get("q"));
  const gl: LocationName = validateLocation(query.get("l"));
  const res = await fetch(
    "http://google.com/complete/search?" +
      obj2search({ client: "chrome", q, gl })
  )
    .then(async (res) => {
      const ct = res.headers.get("content-type");
      const {
        parameters: { charset },
      } = parse(ct);
      const decoder = new TextDecoder(charset);
      const buffer = await res.arrayBuffer();
      const txt = decoder.decode(buffer);
      return txt;
    })
    .then((txt) => JSON.parse(txt));

  const suggestions: string[] = res[1].filter(
    (_, i: number): boolean => res[4]["google:suggesttype"][i] === "QUERY"
  );

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
    status: 200,
    headers: {
      // Netlify, doesn't currently use query strings in the cache key: https://community.netlify.com/t/netlify-function-with-query-strings-ignores-custom-cache-control-header/15390/20
      // 'Cache-Control': 'public, max-age=604800, s-maxage=604800',
      "Content-Type": "application/json",
    },
    body: suggestions,
  };
};
