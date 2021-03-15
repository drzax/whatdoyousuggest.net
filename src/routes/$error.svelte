<script lang="ts">
  import Header from "$lib/Header.svelte";
  export let error: Error;
  export let status: number;
</script>

<Header />

<main>
  <h1>Error</h1>
  {error}
  {status}
</main>

<style lang="scss">
  main {
    max-width: 40em;
    margin: 3rem auto;
    padding: 0 40px;
  }
</style>
