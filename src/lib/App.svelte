<script lang="ts">
  import type { LocationName, EngineId } from "../types";
  import { onMount } from "svelte";
  import LocationSelector from "$lib/LocationSelector.svelte";
  import Spinner from "$lib/Spinner.svelte";
  import Header from "$lib/Header.svelte";
  import WordTree from "$lib/WordTree.svelte";
  import { browser } from "$app/env";
  import {
    endpoint,
    inputsFromForm,
    pathToProps,
    normaliseSuggestionData,
    validateLocation,
  } from "$lib/utils";
  import { defaultOptions } from "$lib/constants";
  import EngineSelector from "./EngineSelector.svelte";

  const DOMAIN = "whatdoyousuggest.net";

  // Search options
  export let location: LocationName = null;
  export let engine: EngineId = defaultOptions.engine;

  // The sanitised phrase actually sent to search engines
  export let phrase: string;

  // URL friendly representation of the phrase
  export let slug: string;

  // The part of the phrase used as the root term for the visualisation
  export let term: string;

  // The list of suggestions to render with WordTree
  export let suggestions: string[] = [];

  // The value in the input element on the page
  let input = phrase || "";
  let loading: boolean = false;
  let error: string | false = false;
  let requestTimeoutId: number;

  let currentResultsUrl = endpoint(phrase, location, engine);

  let inputElement: HTMLInputElement;

  // TODO: this should really be done with `goto` but the navigation results in the input losing focus.
  // goto(`/${slug}/${location}:${engine}`, { noscroll: true });
  let updateSuggestions = async (
    phrase: string,
    location: LocationName,
    engine: EngineId
  ): Promise<{
    suggestions: string[];
    term: string;
  }> => {
    const res = (await fetch(endpoint(phrase, location, engine)).then((res) =>
      res.json()
    )) as string[];
    const [suggestions, term] = normaliseSuggestionData(res, phrase);
    return { suggestions, term };
  };

  onMount(async () => {
    inputElement.focus();

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
      location = validateLocation(l.toLowerCase());
    }

    // Because we're handling our own history, hack around sveltekit's popstate handler
    history.replaceState(false, document.title, document.location.href);

    const handlePopState = (ev: PopStateEvent) => {
      if (window.location.pathname === "/") {
        input = "";
      } else {
        const {
          slug: s,
          location: l,
          engine: e,
        } = pathToProps(window.location.pathname);
        input = s;
        location = l;
        engine = e;
      }
    };

    addEventListener("popstate", handlePopState);

    return () => {
      removeEventListener("popstate", handlePopState);
    };
  });

  $: [phrase, slug] = inputsFromForm(input);

  $: if (phrase.length === 0) {
    term = "";
    suggestions = [];
    currentResultsUrl = "";
    browser && history.pushState(false, `What do you suggest?`, `/`);
  } else {
    const updatesUrl = endpoint(phrase, location, engine);
    if (browser && updatesUrl !== currentResultsUrl) {
      loading = true;
      error = false;
      window.clearTimeout(requestTimeoutId);
      requestTimeoutId = window.setTimeout(() => {
        updateSuggestions(phrase, location, engine)
          .then((updates) => {
            loading = false;
            error = false;
            currentResultsUrl = updatesUrl;
            const pathname = `/${slug}/${location}:${engine}`;
            const title = `${
              phrase.length ? phrase + " - " : ""
            }What do you suggest?`;
            if (pathname !== window.location.pathname) {
              history.pushState(false, title, pathname);
            }
            ({ suggestions, term } = updates);
          })
          .catch((e) => {
            loading = false;
            error = "Error loading suggestions";
          });
      }, 300);
    }
  }

  $: ogImage = encodeURI(
    `https://fallback-automation.now.sh/api?url=https://${DOMAIN}/${
      slug || "what+do+you+suggest"
    }/${location}:${engine}&selector=.tree&width=500`
  );
</script>

<svelte:head>
  <title>{`${phrase.length ? phrase + " - " : ""}What do you suggest?`}</title>
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
    <div class:used={input.length} class="input">
      <input
        type="text"
        placeholder="Suggest this ..."
        bind:value={input}
        bind:this={inputElement}
      />
      <EngineSelector bind:engine />
    </div>
  </div>
  <div class="chart">
    {#if phrase && term && slug}
      {#if loading}
        <Spinner />
      {:else if error}
        <p class="no-suggestions">{error}</p>
      {:else if suggestions.length}
        <WordTree {suggestions} {term} />
      {:else}
        <p class="no-suggestions">No suggestions!</p>
      {/if}
    {/if}
  </div>
  <div class="attribution">
    <p>
      <a href="/about">What is this?</a> |
      <a href="/about/privacy">Privacy Policy</a>
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
    display: flex;
    align-items: center;
  }
</style>
