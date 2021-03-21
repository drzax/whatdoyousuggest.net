<script lang="ts">
  import type { EngineId } from "../types";
  import { engines } from "$lib/constants";
  export let engine: EngineId;
</script>

<div role="radiogroup">
  {#each engines as e}
    <button
      on:click={() => (engine = e.id)}
      role="radio"
      aria-checked={e.id === engine}>{e.name}</button
    >
  {/each}
</div>

<style lang="scss">
  div {
    text-align: center;
  }
  button {
    border: none;
    font-weight: normal;
    background-color: transparent;
    cursor: pointer;
    &[aria-checked="true"] {
      text-decoration: underline;
    }
  }
</style>
