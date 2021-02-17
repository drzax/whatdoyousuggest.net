<script type="typescript">
  // imports
  import Button from "$components/Button.svelte";
  import lookup from "country-code-lookup";

  // exports / props
  export let selection = "AU";

  // constants
  const g20 = [
    "AR",
    "AU",
    "BR",
    "CA",
    "CN",
    "FR",
    "DE",
    "IN",
    "ID",
    "IT",
    "JP",
    "MX",
    "RU",
    "SA",
    "ZA",
    "KR",
    "TR",
    "GB",
    "US",
  ];

  // state
  let open: boolean = false;
</script>

<div class="menu">
  <Button on:click={() => (open = !open)}>{selection}</Button>
  {#if open}
    <ul class="pop">
      {#each g20 as code}
        <li
          on:click={() => {
            selection = code;
            open = false;
          }}
        >
          {lookup.byIso(code).country}
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
