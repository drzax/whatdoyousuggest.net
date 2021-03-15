<script lang="ts">
  import { onMount } from "svelte";
  import LocationSelector from "$lib/LocationSelector.svelte";
  import Spinner from "$lib/Spinner.svelte";
  import Header from "$lib/Header.svelte";
  import WordTree from "$lib/WordTree.svelte";
  import {
    endpoint,
    inputsFromForm,
    pathToProps,
    splitOutRootTerms,
    validateLocation,
  } from "$lib/utils";
  import { defaultOptions } from "$lib/constants";
  import debounce from "debounce";
  import EngineSelector from "./EngineSelector.svelte";
  export let phrase: string;
  export let location: LocationName = null;
  export let term: string;
  export let slug: string;
  export let engine: EngineId = defaultOptions.engine;
  export let suggestions: string[] = [];

  let input = phrase || "";
  let domain = "deploy-preview-24--laughing-euclid-388e47.netlify.app";
  let loading: boolean = false;
  let current: string = endpoint(phrase, location, engine);

  onMount(async () => {
    if (!location) {
      let l = localStorage.location;

      if (!l) {
        try {
          const res = await fetch(
            "https://api.ipstack.com/check?access_key=91246e1a4ce26b50d45c058b2adc30eb"
          );
          const locationData = await res.json();
          l = locationData.country_code.toLowerCase();
        } catch (e) {
          l = defaultOptions.location;
        }
      }
      location = validateLocation(l);
    }

    window.onpopstate = () => {
      const { slug: s, location: l, engine: e } = pathToProps(
        window.location.pathname
      );

      input = s;
      location = l;
      engine = e;
    };

    domain = document.location.host;
  });

  const updateSuggestions = debounce(
    async (input: string, location: LocationName, engine: EngineId) => {
      // TODO: this should really be done with `goto` but the navigation results in the input losing focus.
      // goto(`/${input}/${location}:${engine}`, { noscroll: true });

      // Bail if we're on the server
      // TODO: find out properly avoid running this for SSR
      if (typeof window === "undefined") return;

      // Don't bother searching if there is no input
      if (input.length === 0) {
        phrase = undefined;
        term = undefined;
        slug = undefined;
        return;
      }

      [phrase, term, slug] = inputsFromForm(input);

      const url = endpoint(phrase, location, engine);

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
          `/${slug}/${location}:${engine}`
        );
      }
    },
    300
  );
  $: updateSuggestions(input, location, engine);
  $: ogImage = encodeURI(
    `https://fallback-automation.now.sh/api?url=https://${domain}/${
      slug || "what-do-you-suggest"
    }/${location}:${engine}&selector=.tree&width=500`
  );
</script>

<svelte:head>
  <title>{phrase ? `${phrase} - ` : ""}What do you suggest?</title>
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@drzax" />
  <meta name="og:title" content="What do you suggest?" />
  <meta
    name="og:description"
    content="Explore the suggestions offered by search engines including Google, Bing, Yahoo and DuckDuckGo."
  />
  <meta name="og:image" content={ogImage} />
  <meta
    name="twitter:image:alt"
    content="Search suggestions for the phrase: {phrase}"
  />
</svelte:head>

<main class="container">
  <Header />

  <div class="inputContainer">
    <div class={`input ${phrase && term && slug ? "used" : "empty"}`}>
      <input type="text" placeholder="Suggest this ..." bind:value={input} />
      <EngineSelector bind:engine />
    </div>
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
    transition: margin 0.3s linear, font-size 0.3s linear;
    &.used {
      margin: 1rem auto;

      input {
        font-size: 1.5rem;
      }
    }

    input {
      margin: 0 auto;
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
  }
  .no-suggestions {
    color: #aaa;
    text-align: center;
    font-size: 2rem;
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
