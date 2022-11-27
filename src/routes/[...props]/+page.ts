import { error } from '@sveltejs/kit';
import type { PageLoad } from "@sveltejs/kit";
import {
  endpoint,
  normaliseSuggestionData,
  slugToPhrase,
  optionsStringToObject,
} from "$lib/utils";

export const load: PageLoad = async ({ page, fetch }) => {
  let optionsString: string | undefined;
  let slug: string;
  let more: string;
  [slug, optionsString, more] = page.params.props.split("/");

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

  throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292693)");
  return {
    maxage: 86400, // 24 hrs
    props: { phrase, term, slug, suggestions, location, engine },
  };
};
