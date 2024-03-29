import { validateLocation, getLangByLocation, obj2search } from "$lib/utils";
import type { LocationName } from "../../../types";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ fetch, url: { searchParams } }) => {
  const q: string = encodeURIComponent(searchParams.get("q") || "");
  const l: LocationName = validateLocation(searchParams.get("l"));
  const res = await fetch(
    "https://duckduckgo.com/ac/?" +
      obj2search({
        q,
        kl: `${l}-${getLangByLocation(l)}`,
      })
  ).then((res) => res.json());

  const suggestions = Array.isArray(res) ? res.map((d) => d.phrase) : [];

  return new Response(JSON.stringify(suggestions), {
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });
};
