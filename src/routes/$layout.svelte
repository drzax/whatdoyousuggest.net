<script lang="ts">
  // TODO: Import bugsnag here instead of in app.html
  // import Bugsnag from "@bugsnag/js";
  // Bugsnag.start({ apiKey: "85507ac85c195f70b8be68b919e60fa2" });
</script>

<svelte:head>
  <title>What do you suggest?</title>
</svelte:head>

<slot />

<style lang="scss">
  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }

  :global(body) {
    margin: 0;
    padding: 0;
  }
</style>
