import { parse } from "content-type";
import { obj2search, validateLocation } from "$lib/utils";

import type { LocationName } from "../../../types";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ fetch, url: { searchParams } }) => {
  const q: string = encodeURIComponent(searchParams.get("q") || "");
  const gl: LocationName = validateLocation(searchParams.get("l"));
  const res = await fetch(
    "http://google.com/complete/search?" +
      obj2search({ client: "chrome", q, gl })
  )
    .then(async (res) => {
      const ct = res.headers.get("content-type");
      const {
        parameters: { charset },
      } = parse(ct || "text/plain");
      const decoder = new TextDecoder(charset);
      const buffer = await res.arrayBuffer();
      const txt = decoder.decode(buffer);
      return txt;
    })
    .then((txt) => JSON.parse(txt));

  const suggestions: string[] = res[1].filter(
    (_, i: number): boolean => res[4]["google:suggesttype"][i] === "QUERY"
  );
  return new Response(JSON.stringify(suggestions), {
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });
};
