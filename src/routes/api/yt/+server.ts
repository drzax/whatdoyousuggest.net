import { getLangByLocation, obj2search, validateLocation } from "$lib/utils";

import type { LocationName } from "../../../types";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ fetch, url: { searchParams } }) => {
  const qry: string = encodeURIComponent(searchParams.get("q"));
  const l: LocationName = validateLocation(searchParams.get("l"));

  // https://suggestqueries-clients6.youtube.com/complete/search?client=youtube&hl=en-gb&gl=au&sugexp=uqappauxgau2%2Cytpso.bo.me%3D1%2Cytpsoso.bo.me%3D1%2Cytpso.bo.bro.mi%3D24409463%2Cytpsoso.bo.bro.mi%3D24409463%2Cytpo.bo.me%3D1%2Cytposo.bo.me%3D1%2Cytpo.bo.ro.mi%3D24414337%2Cytposo.bo.ro.mi%3D24414337%2Ccfro%3D1%2Cytpso.bo.me%3D0%2Cytpsoso.bo.me%3D0%2Cytpso.bo.bro.mi%3D24412967%2Cytpsoso.bo.bro.mi%3D24412967%2Cytpo.bo.me%3D0%2Cytposo.bo.me%3D0%2Cytpo.bo.ro.mi%3D24412971%2Cytposo.bo.ro.mi%3D24412971&gs_rn=64&gs_ri=youtube&tok=Dt_wr3xBLBAFiiPbzon9TQ&ds=yt&cp=4&gs_id=d&q=test&callback=google.sbox.p50&gs_gbg=Ku5catbwNd52
  /*
client=youtube
hl=en-gb
gl=au
sugexp=qsate2%2Cytpo.bo.me%3D1%2Cytposo.bo.me%3D1%2Cytpo.bo.ei%3D45376695%2Cytposo.bo.ei%3D45376695%2Ccfro%3D1%2Cytpo.bo.me%3D0%2Cytposo.bo.me%3D0%2Cytpo.bo.ei%3D45358232%2Cytposo.bo.ei%3D45358232
gs_rn=64
gs_ri=youtube
ds=yt
cp=4
gs_id=g
q=test
xhr=t
xssi=t
*/
  const params = {
    client: "youtube",
    // hl: "en-gb",
    hl: getLangByLocation(l),
    gl: l,
    // sugexp:
    //   "uqappauxgau2%2Cytpso.bo.me%3D1%2Cytpsoso.bo.me%3D1%2Cytpso.bo.bro.mi%3D24409463%2Cytpsoso.bo.bro.mi%3D24409463%2Cytpo.bo.me%3D1%2Cytposo.bo.me%3D1%2Cytpo.bo.ro.mi%3D24414337%2Cytposo.bo.ro.mi%3D24414337%2Ccfro%3D1%2Cytpso.bo.me%3D0%2Cytpsoso.bo.me%3D0%2Cytpso.bo.bro.mi%3D24412967%2Cytpsoso.bo.bro.mi%3D24412967%2Cytpo.bo.me%3D0%2Cytposo.bo.me%3D0%2Cytpo.bo.ro.mi%3D24412971%2Cytposo.bo.ro.mi%3D24412971",
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
