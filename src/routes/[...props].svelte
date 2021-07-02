<script context="module" lang="ts">
  import type { Load } from "@sveltejs/kit";
  import {
    endpoint,
    normaliseSuggestionData,
    slugToPhrase,
    optionsStringToObject,
  } from "$lib/utils";

  export const load: Load = async ({ page, fetch }) => {
    let optionsString: string | undefined;
    let slug: string;
    let more: string;
    [slug, optionsString, more] = page.params.props.split("/");

    // This route should only match urls with two segments so fall through otherwise.
    // TODO: This should fall through rather than return an error, but sveltekit doesn't like that for some reason.
    if (more) return { status: 404, error: new Error("Not found") };

    // TODO: ideally a missing optionsString would result in a server redirect here, but location, as it's currently used can't be determined here because the default is detected on the client and selected user pref is stored in local storage.

    const { location, engine } = optionsStringToObject(optionsString);
    const phrase = slugToPhrase(slug);

    const res = (await fetch(endpoint(phrase, location, engine)).then((r) =>
      r.json()
    )) as string[];

    const [suggestions, term] = normaliseSuggestionData(res, phrase);

    return {
      maxage: 86400, // 24 hrs
      props: { phrase, term, slug, suggestions, location, engine },
    };
  };
</script>

<script lang="ts">
  import App from "$lib/App.svelte";
  import type { LocationName, EngineId } from "../types";
  export let phrase: string;
  export let term: string;
  export let slug: string;
  export let location: LocationName;
  export let engine: EngineId;
  export let suggestions: string[];
</script>

<App {phrase} {term} {slug} {suggestions} {location} {engine} />
