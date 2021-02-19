<script context="module" lang="ts">
  import {
    endpoint,
    splitOutRootTerms,
    inputsFromSlug,
    optionsStringToObject,
  } from "$lib/utils";
  import type { LocationName, EngineName } from "$lib/constants";
  export async function load({ page, fetch }) {
    let optionsString: string | undefined;
    let slug: string;
    [slug, optionsString] = page.params.props;

    const { location, engine } = optionsStringToObject(optionsString);

    const [phrase, term] = inputsFromSlug(slug);
    // todo: figure out how to get the user's selected location here
    const res = await fetch(endpoint(phrase, location, engine));
    const raw = await res.json();
    const suggestions: string[] = splitOutRootTerms(raw, phrase);
    return { props: { phrase, term, slug, suggestions, location, engine } };
  }
</script>

<script lang="ts">
  import App from "$components/App.svelte";
  export let phrase: string;
  export let term: string;
  export let slug: string;
  export let location: LocationName;
  export let engine: EngineName;
  export let suggestions: string[];
</script>

<App {phrase} {term} {slug} {suggestions} {location} {engine} />
