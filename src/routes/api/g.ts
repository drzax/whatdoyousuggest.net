import fetch from "node-fetch";
import { obj2search, validateLocation } from "$lib/utils";
import type { LocationName } from "../../types";

export const get = async ({ query }) => {
  const q: string = encodeURIComponent(query.get("q"));
  const gl: LocationName = validateLocation(query.get("l"));
  const res = await fetch(
    "http://google.com/complete/search?" +
      obj2search({ client: "chrome", q, gl })
  ).then((res) => {
    return res.json();
  });

  const suggestions: string[] = res[1].filter(
    (_, i: number): boolean => res[4]["google:suggesttype"][i] === "QUERY"
  );

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
