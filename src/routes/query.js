import got from "got";

export const get = async ({ query }) => {
  const q = query.get("q");
  const gl = query.get("gl");
  const res = await got("http://google.com/complete/search", {
    responseType: "json",
    searchParams: { client: "chrome", q, gl },
  });
  const suggestions = res.body[1].filter(
    (d, i) => res.body[4]["google:suggesttype"][i] === "QUERY"
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
