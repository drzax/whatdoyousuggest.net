<script lang="ts">
  import Header from "$lib/Header.svelte";
</script>

<Header />

<main>
  <slot />
</main>

<style lang="scss">
  main {
    max-width: 40em;
    margin: 3rem auto;
    padding: 0 40px;
  }

  :global(hr) {
    margin: 3rem 0;
  }
</style>
