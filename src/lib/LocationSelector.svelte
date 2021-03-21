<script type="typescript">
  // imports
  import Button from "$lib/Button.svelte";
  import { byIso } from "country-code-lookup";
  import { locations } from "$lib/constants";

  // exports / props
  export let selection: LocationName;

  // state
  let open: boolean = false;
</script>

<div class="menu">
  <Button on:click={() => (open = !open)}>{selection.toUpperCase()}</Button>
  {#if open}
    <ul class="pop">
      {#each locations as code}
        <li
          on:click={() => {
            selection = code;
            // TODO: this should be handled in App
            localStorage.location = code;
            open = false;
          }}
        >
          {byIso(code).country}
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style lang="scss">
  .menu {
    position: relative;
    display: flex;
    justify-content: end;
    padding: 0;

    .pop {
      position: absolute;
      bottom: calc(100% + 4px);
      right: 0;
      width: 10rem;
      list-style: none;
      background-color: #fff;
      border: 1px solid #ccc;
      border-radius: 4px;
      margin: 0;
      padding: 0;
      max-height: 60vh;
      overflow-y: auto;
      li {
        margin: 0;
        padding: 0.6rem 0.4rem;
        border-bottom: 1px solid #ccc;
        &:last-child {
          border-bottom: 0;
        }
      }
    }
  }
</style>
