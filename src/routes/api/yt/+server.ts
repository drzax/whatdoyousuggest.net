import { getLangByLocation, obj2search, validateLocation } from "$lib/utils";

import type { LocationName } from "../../../types";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ fetch, url: { searchParams } }) => {
  const qry: string = encodeURIComponent(searchParams.get("q") || "");
  const l: LocationName = validateLocation(searchParams.get("l"));

  const params = {
    client: "youtube",
    hl: getLangByLocation(l),
    gl: l,
    gs_rn: "64",
    gs_ri: "youtube",
    ds: "yt",
    cp: "4",
    gs_id: "d",
    q: qry,
    xhr: "t",
  };

  const res = await fetch(
    "https://suggestqueries-clients6.youtube.com/complete/search?" +
      obj2search(params)
  ).then((res) => res.json());

  const suggestions = res[1].map((d) => d[0]);

  return new Response(JSON.stringify(suggestions), {
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });
};
