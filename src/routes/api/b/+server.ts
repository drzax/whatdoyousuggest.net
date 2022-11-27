import fetch from "node-fetch";
import { decode } from "html-entities";
import { getLangByLocation, obj2search, validateLocation } from "$lib/utils";

import type { LocationName } from "../../../types";
import type { RequestHandler } from "./$types";

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

  return new Response(JSON.stringify(suggestions), {
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });
};
