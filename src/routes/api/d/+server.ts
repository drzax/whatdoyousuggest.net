import fetch from "node-fetch";
import { validateLocation, getLangByLocation, obj2search } from "$lib/utils";

import type { LocationName } from "../../types";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ query }) => {
  const q: string = encodeURIComponent(query.get("q"));
  const l: LocationName = validateLocation(query.get("l"));
  const res = await fetch(
    "https://duckduckgo.com/ac/?" +
      obj2search({
        q,
        kl: `${l}-${getLangByLocation(l)}`,
      })
  ).then((res) => res.json());

  const suggestions = Array.isArray(res) ? res.map((d) => d.phrase) : [];

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
