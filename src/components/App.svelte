<script lang="ts">
  import { onMount } from "svelte";
  import LocationSelector from "$components/LocationSelector.svelte";
  import Spinner from "$components/Spinner.svelte";
  import WordTree from "$components/WordTree.svelte";
  import { endpoint, inputsFromForm, splitOutRootTerms } from "$lib/utils";
  import debounce from "debounce";
  export let phrase: string;
  export let location: string = null;
  export let term: string;
  export let slug: string;
  export let suggestions: string[] = [];

  let input = phrase || "";

  let loading: boolean = false;
  let current: string = endpoint(phrase, location);

  onMount(async () => {
    if (!location) {
      try {
        const res = await fetch(
          "http://api.ipstack.com/check?access_key=91246e1a4ce26b50d45c058b2adc30eb"
        );
        const locationData = await res.json();
        location = locationData.country_code;
      } catch (e) {
        location = "AU";
      }
    }

    window.onpopstate = () => {
      const [l, s] = window.location.pathname.substr(1).split("/");
      location = l.toUpperCase();
      input = s;
    };
  });

  const updateSuggestions = debounce(
    async (input: string, location: string) => {
      // Bail if we're on the server
      if (typeof fetch === "undefined") return;

      // Don't bother searching if there is no input
      if (input.length === 0) {
        phrase = undefined;
        term = undefined;
        slug = undefined;
        history &&
          history.pushState(
            null,
            `What do you suggest?`,
            `/${location}`.toLocaleLowerCase()
          );
        return;
      }

      [phrase, term, slug] = inputsFromForm(input);

      const url = endpoint(phrase, location);

      // Bail if this is what we already have
      if (url === current) return;

      loading = true;
      current = url;
      const res = await fetch(url);
      const sug = await res.json();
      if (current === url) {
        loading = false;
        // todo: this should probably live somewhere else: WordTree component or own function or server route
        suggestions = splitOutRootTerms(sug, phrase);
        history.pushState(
          null,
          `${phrase} - What do you suggest?`,
          `/${location}/${slug}`.toLocaleLowerCase()
        );
      }
    },
    300
  );
  $: updateSuggestions(input, location);
</script>

<svelte:head>
  <title>{phrase ? `${phrase} - ` : ""}What do you suggest?</title>
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
  <h1 class="title">
    <a href="/"
      ><img
        class="logo"
        src="/noun_arrow scratch_1195136.svg"
        alt="A wiggly arrow ultimately pointing to the right"
      /> WDYS?</a
    >
  </h1>

  <div class="inputContainer">
    <input
      class={`input ${phrase && term && slug ? "used" : "empty"}`}
      type="text"
      placeholder="Suggest this ..."
      bind:value={input}
    />
  </div>
  <div class="chart">
    {#if phrase && term && slug}
      {#if loading}
        <Spinner />
      {:else if suggestions.length}
        <WordTree {suggestions} {term} />
      {:else}
        <p class="no-suggestions">No suggestions!</p>
      {/if}
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
    <p>
      Icon by Carol van Waart from <a
        href="https://thenounproject.com/term/arrow-scratch/1195136/"
        >the Noun Project</a
      >
    </p>
  </div>
  <div class="options">
    {#if location}<LocationSelector bind:selection={location} />{/if}
  </div>
</main>

<style lang="scss">
  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }

  :global(body) {
    margin: 0;
    padding: 0;
  }

  .title {
    font-size: 1rem;
    margin-top: 3rem;
    text-align: center;
    grid-column-start: 1;
    grid-column-end: 3;
    a {
      text-decoration: none;
      color: inherit;
    }
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
    transition: margin 0.3s linear, font-size 0.3s linear;
    &.used {
      font-size: 1.5rem;
      margin: 1rem auto;
    }
  }
  .no-suggestions {
    color: #aaa;
    text-align: center;
    font-size: 2rem;
  }

  .logo {
    width: 70px;
    height: auto;
    display: inline-block;
    vertical-align: middle;
  }

  .options {
    align-self: end;
    padding: 1rem;
  }

  .attribution {
    font-size: 0.8rem;
    line-height: 1.1;
    padding: 0 1rem;
  }
</style>
