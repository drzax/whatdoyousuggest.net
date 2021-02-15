<script type="typescript">
  import Button from "$components/Button.svelte";
  import lookup from "country-code-lookup";
  const modifiedCountryNames = {
    US: "United States of America",
    GB: "United Kingdom",
    RU: "Russia",
  };

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

  export let selection = lookup.byIso("US");
  let open: boolean = false;
</script>

<div>
  <Button on:click={() => (open = true)}
    >{selection ? selection.code : selection.iso2}</Button
  >
  {#if open}
    <ul>
      {#each g20 as code}
        <li
          on:click={() => {
            selection = lookup.byIso(code);
            open = false;
          }}
        >
          {lookup.byIso(code).country}
        </li>
      {/each}
    </ul>
  {/if}
</div>
