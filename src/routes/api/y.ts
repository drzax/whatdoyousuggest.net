import { validateLocation, getLangByLocation } from "$lib/utils";
import type { LocationName } from "$lib/constants";

import got from "got";

export const get = async ({ query }) => {
  const q: string = query.get("q");
  const l: LocationName = validateLocation(query.get("l"));
  const res = await got(
    `https://${l}.search.yahoo.com/sugg/gossip/gossip-${l}-ura/`,
    {
      responseType: "json",
      searchParams: {
        nresults: 10,
        output: "sd1",
        command: q,
      },
    }
  );

  const suggestions = res.body.hasOwnProperty("r")
    ? res.body["r"].map((d) => d.k)
    : [];

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
