<script lang="ts">
  import LocationSelector from "$components/LocationSelector.svelte";
  import { endpoint, splitOutRootTerms } from "$lib/utils";
  import debounce from "debounce";
  import WordTree from "./WordTree.svelte";
  export let phrase: string;
  export let term: string;
  export let slug: string;
  export let suggestions: string[] = [];

  const sanitiseTerm = (str: string) =>
    str
      .toLowerCase()
      .replace(/[.,\\/#!$%\\^&\\*;:{}=\-_`~()\\?]/g, "")
      .replace(/\+/g, " ");

  let loading: boolean = false;
  let current: string;
  const updateSuggestions = async () => {
    if (phrase.length === 0) {
      history.pushState(null, `What do you suggest?`, `/`);
      return;
    }
    loading = true;
    // todo figure out how to incorporate location
    const url = endpoint(phrase, "US");
    current = url;
    const res = await fetch(url);
    const sug = await res.json();
    if (current === url) {
      loading = false;
      // todo: this should probably live somewhere else: WordTree component or own function or server route
      suggestions = splitOutRootTerms(sug, phrase);
      history.pushState(null, `${phrase} - What do you suggest?`, `/${slug}`);
    }
  };

  const handleSubmit = () => updateSuggestions();
  const handleInput = debounce(updateSuggestions, 300);

  let location: { name: string; code: string };
</script>

<svelte:head>
  <title>{phrase} - What do you suggest?</title>
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@drzax" />
  <meta name="og:title" content="What do you suggest?" />
  <meta name="og:description" content="Explore Google's search suggestions." />
  <meta
    name="og:image"
    content="https://elvery.net/drzax/user/files/Screen%20Shot%202018-03-20%20at%2011.27.19%20am.png"
  />
  <meta
    name="twitter:image:alt"
    content="An example word tree diagram showing Google's search suggestions for: what do
			you suggest"
  />
</svelte:head>

<main class="container">
  <h1 class="title">WDYS?</h1>

  <div class="inputContainer">
    <form on:submit|preventDefault={handleSubmit}>
      <input
        class="input"
        type="text"
        placeholder="Suggest this ..."
        on:keyup={handleInput}
        bind:value={phrase}
      />
    </form>
  </div>

  <div class="chart">
    {#if loading}
      loading...
    {:else}
      <WordTree {suggestions} {term} />
    {/if}
  </div>
  <div class="attribution">
    <p>
      {"A resurrected experiment by "}
      <a href="https://twitter.com/drzax"> drzax </a> (<a
        href="https://github.com/drzax/whatdoyousuggest.net"
      >
        code
      </a>{" "}
      | <a href="https://elvery.net/drzax/tag/wdys">explanation</a>).
    </p>
  </div>
  <div class="options">
    <LocationSelector bind:selection={location} />
  </div>
</main>

<style lang="scss">
  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }

  body {
    margin: 0;
  }

  .title {
    font-size: 1rem;
    text-align: center;
    grid-column-start: 1;
    grid-column-end: 3;
  }

  .chart {
    grid-column-start: 1;
    grid-column-end: 3;
  }

  .container {
    display: grid;
    grid-template-columns: 50% 50%;
    grid-template-rows: auto auto 100fr auto;
    font-family: sans-serif;
    min-height: 100vh;
    box-sizing: border-box;
  }

  .inputContainer {
    grid-column-start: 1;
    grid-column-end: 3;
  }

  .input {
    transition: margin 0.3s ease-in-out, font-size 0.3s ease-in-out;
    margin: 6rem auto;
    display: block;
    font-size: 3rem;
    padding: 0.3em;
    border: 1px solid #ccc;
    border-radius: 0.2em;
    max-width: 100%;
    box-sizing: border-box;
    text-align: center;
    max-width: 90vw;
  }
</style>
