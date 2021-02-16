<script context="module" lang="ts">
  import { endpoint, splitOutRootTerms, inputsFromSlug } from "$lib/utils";
  export async function load({ page, session, fetch, context }) {
    const { slug } = page.params;
    const [phrase, term] = inputsFromSlug(slug);
    // todo: figure out how to get the user's selected location here
    const res = await fetch(endpoint(phrase, "US"));
    const raw = await res.json();
    const suggestions: string[] = splitOutRootTerms(raw, phrase);
    return { props: { phrase, term, slug, suggestions } };
  }
</script>

<script lang="ts">
  import App from "$components/App.svelte";
  export let phrase: string;
  export let term: string;
  export let slug: string;
  export let suggestions: string[];
</script>

<App {phrase} {term} {slug} {suggestions} />
