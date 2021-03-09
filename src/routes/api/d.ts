import { validateLocation, getLangByLocation } from "../../lib/utils";
import type { LocationName } from "../../lib/constants";
import fetch from "node-fetch";

export const get = async ({ query }) => {
  const q: string = query.get("q");
  const l: LocationName = validateLocation(query.get("l"));
  const params = new URLSearchParams({
    q,
    kl: `${l}-${getLangByLocation(l)}`,
  });
  const res = await fetch(
    "https://duckduckgo.com/ac/?" + params.toString()
  ).then((res) => res.json());

  const suggestions = Array.isArray(res) ? res.map((d) => d.phrase) : [];

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
