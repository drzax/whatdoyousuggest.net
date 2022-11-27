import { json as json$1 } from '@sveltejs/kit';
import fetch from "node-fetch";
import { validateLocation, obj2search } from "$lib/utils";

import type { LocationName } from "../../../types";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ query }) => {
  const q: string = encodeURIComponent(query.get("q"));
  let l: LocationName = validateLocation(query.get("l"));

  // Yahoo apparently redirects cn to sg.
  l = l === "cn" ? "sg" : l;

  const res = await fetch(
    `https://${l}.search.yahoo.com/sugg/gossip/gossip-${l}-ura/?` +
      obj2search({
        nresults: "10",
        output: "sd1",
        command: q,
      })
  ).then((res) => res.json());

  const suggestions = res.hasOwnProperty("r") ? res.r.map((d) => d.k) : [];

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
