import got from "got";
import type { LocationName } from "$lib/constants";

export const get = async ({ query }) => {
  const q: string = query.get("q");
  const gl: LocationName = query.get("l");
  const res = await got("http://google.com/complete/search", {
    responseType: "json",
    searchParams: { client: "chrome", q, gl },
  });
  const suggestions: string[] = res.body[1].filter(
    (_, i: number): boolean => res.body[4]["google:suggesttype"][i] === "QUERY"
  );

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
