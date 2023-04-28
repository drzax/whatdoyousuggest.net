import { validateLocation, getLangByLocation, obj2search } from "$lib/utils";
import type { LocationName } from "../../../types";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ fetch, url: { searchParams } }) => {
  const q: string = encodeURIComponent(searchParams.get("q") || "");
  const l: LocationName = validateLocation(searchParams.get("l"));
  const res = await fetch(
    "https://search.brave.com/api/suggest?" +
      obj2search({
        q,
        rich: true,
        source: "web",
        // kl: `${l}-${getLangByLocation(l)}`,
      })
  ).then((res) => res.json());

  const suggestions = Array.isArray(res) ? res[1].map((d) => d.q) : [];

  return new Response(JSON.stringify(suggestions), {
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });
};
