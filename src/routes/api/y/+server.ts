import fetch from "node-fetch";
import { validateLocation, obj2search } from "$lib/utils";

import type { LocationName } from "../../../types";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url: { searchParams } }) => {
  const q: string = encodeURIComponent(searchParams.get("q") || "");
  let l: LocationName = validateLocation(searchParams.get("l"));

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
  return new Response(JSON.stringify(suggestions), {
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });
};
