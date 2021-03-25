<script lang="ts">
  import { browser } from "$app/env";
  import Header from "$lib/Header.svelte";
  export let error: Error;
  export let status: number;

  if (browser) {
    window?.Bugsnag?.notify(error);
  }
</script>

<div class="wrap">
  <Header />

  <main>
    {#if status === 404}
      <p>
        this thing is not found<br />your quest can continue but<br />and must
        start from
        <a target="_self" href="/">home</a>
      </p>{:else}
      <p>
        the cause is unclear<br />mood maybe darkened but you<br />can try again
        <a target="_self" href="/">here</a>
      </p>
    {/if}
  </main>
</div>

<style lang="scss">
  .wrap {
    min-height: 100vh;
    display: grid;
    justify-content: center;
    flex-direction: column;
    grid-template-rows: auto 100fr;
    grid-template-columns: 100fr;
  }
  main {
    max-width: 40em;
    margin: 3rem auto;
    padding: 0 40px;
    text-align: center;
    font-size: 0.8rem;
    line-height: 1.6;
  }
</style>
