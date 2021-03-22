<script context="module" lang="ts">
  import {
    endpoint,
    splitOutRootTerms,
    inputsFromSlug,
    optionsStringToObject,
  } from "$lib/utils";

  export async function load({ page, fetch }) {
    let optionsString: string | undefined;
    let slug: string;
    [slug, optionsString] = page.params.props.split("/");

    const { location, engine } = optionsStringToObject(optionsString);

    const [phrase, term] = inputsFromSlug(slug);
    let suggestions: string[] = [];
    const end = endpoint(phrase, location, engine);

    try {
      const res = await fetch(end).then((r) => r.json());
      suggestions = splitOutRootTerms(res, phrase);
    } catch (e) {
      console.error(e);
    }
    return { props: { phrase, term, slug, suggestions, location, engine } };
  }
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
