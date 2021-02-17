<script context="module" lang="ts">
  import { endpoint, splitOutRootTerms, inputsFromSlug } from "$lib/utils";
  export async function load({ page, session, fetch, context }) {
    let location: string;
    let slug: string;
    [location, slug] = page.params.props;

    if (!slug) {
      slug = location;
      location = "au";
    }

    const [phrase, term] = inputsFromSlug(slug);
    // todo: figure out how to get the user's selected location here
    const res = await fetch(endpoint(phrase, location.toUpperCase()));
    const raw = await res.json();
    const suggestions: string[] = splitOutRootTerms(raw, phrase);
    return { props: { phrase, term, slug, suggestions, location } };
  }
</script>

<script lang="ts">
  import App from "$components/App.svelte";
  export let phrase: string;
  export let term: string;
  export let slug: string;
  export let location: string;
  export let suggestions: string[];
</script>

<App {phrase} {term} {slug} {suggestions} location={location.toUpperCase()} />
