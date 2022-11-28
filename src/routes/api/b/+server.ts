import { getLangByLocation, obj2search, validateLocation } from "$lib/utils";
import { fromHtml } from "hast-util-from-html";
import { selectAll } from "hast-util-select";
import type { LocationName } from "../../../types";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ fetch, url: { searchParams } }) => {
  const qry: string = encodeURIComponent(searchParams.get("q") || "");
  const l: LocationName = validateLocation(searchParams.get("l"));
  const res = await fetch(
    "https://www.bing.com/AS/Suggestions?" +
      obj2search({
        cvid: "a",
        qry,
        mkt: `${getLangByLocation(l)}-${l}`,
      })
  ).then((res) => res.text());
  const hast = fromHtml(res);
  const selected = selectAll('[role="option"]', hast);
  const suggestions = selected.map((d) => d.properties?.query);

  return new Response(JSON.stringify(suggestions), {
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });
};
