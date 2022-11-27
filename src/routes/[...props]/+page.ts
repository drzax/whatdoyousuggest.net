import type { PageLoad } from "./$types";
import { error } from "@sveltejs/kit";
import {
  endpoint,
  normaliseSuggestionData,
  slugToPhrase,
  optionsStringToObject,
} from "$lib/utils";

export const load: PageLoad = async ({ params, fetch, setHeaders }) => {
  let optionsString: string | undefined;
  let slug: string;
  let more: string;
  [slug, optionsString, more] = params.props.split("/");

  // This route should only match urls with two segments so fall through otherwise.
  // TODO: This should fall through rather than return an error, but sveltekit doesn't like that for some reason.
  if (more) throw error(404, "Not found");

  // TODO: ideally a missing optionsString would result in a server redirect here, but location, as it's currently used can't be determined here because the default is detected on the client and selected user pref is stored in local storage.

  const { location, engine } = optionsStringToObject(optionsString);
  const phrase = slugToPhrase(slug);

  const res = (await fetch(endpoint(phrase, location, engine)).then((r) =>
    r.json()
  )) as string[];

  const [suggestions, term] = normaliseSuggestionData(res, phrase);
  setHeaders({
    "cache-control": "public, max-age: 86400",
  });

  return { phrase, term, slug, suggestions, location, engine };
};
