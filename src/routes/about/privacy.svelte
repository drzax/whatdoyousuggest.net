<script lang="ts" context="module">
  export const prerender = true;
</script>

<script lang="ts">
  import Header from "$components/Header.svelte";
  import { onMount } from "svelte";

  let bugReportOptOut: boolean | undefined;
  onMount(() => {
    bugReportOptOut = localStorage.bugReportOptOut === "true";
  });
  const toggleBugReportOptOut = () => {
    bugReportOptOut = !bugReportOptOut;
    localStorage.bugReportOptOut = bugReportOptOut;
    if (bugReportOptOut) localStorage.removeItem("bugsnag-anonymous-id");
    location = location;
  };
</script>

<Header />

<main>
  <h1>Privacy Policy</h1>
  <p>
    This site collects a small amount of data about how it's used. This document
    describes what data is collected and how it's used.
  </p>
  <h2>Who operates this site?</h2>
  <p>
    This site is an experiment built and maintained as a hobby by <a
      href="https://elvery.net">Simon Elvery</a
    >.
  </p>
  <h2>Identifying data and web tracking</h2>
  <p>
    This site does not collect your personal details. I don't know, or want to
    know, who you are.
  </p>
  <p>
    This website does not use cookies from any third parties or include any
    third-party scripts that transmit data about you or your use of the site
    beyond what is mentioned below.
  </p>
  <h2>Access logs</h2>
  <p>My hosting provider, Netlify, logs access to this site.</p>
  <p>
    Netlify stores your IP addresses for up to 30 days after visiting this
    website. This data is used for networking analytics, and is not combined
    with any other identifying data. You can read more about Netlify's <a
      href="https://www.netlify.com/gdpr-ccpa/">privacy commitments</a
    >.
  </p>
  <h2>Bug reports</h2>
  <p>
    By default, whenever a javascript error occurs on this site, details about
    that error are collected using Bugsnag. You can view the <a
      href="https://docs.bugsnag.com/legal/privacy-policy/"
      >Bugsnag privacy policy</a
    > for more details.
  </p>
  {#if typeof bugReportOptOut !== "undefined"}
    <p>
      Further, you can opt out of error reporting. This preference will be
      stored in your browser's local storage and so apply in this browser only
      and will no longer apply if your browser's local storage is cleared.
    </p>
    <label
      ><input
        type="checkbox"
        checked={bugReportOptOut}
        on:change={toggleBugReportOptOut}
      />
      Opt-out of bug reporting on this site<br /><small
        >Changing this preference will refresh the page.</small
      ></label
    >
  {/if}
  <h2>Questions?</h2>
  <p>
    Feel free to <a href="https://elvery.net/drzax/about">get in touch</a> if you
    have any questions.
  </p>
  <hr />
  <p>Last updated on 20 February 2021.</p>
</main>

<style lang="scss">
  main {
    max-width: 40em;
    margin: 3rem auto;
    padding: 0 40px;
  }
  hr {
    margin: 3rem 0;
  }
</style>
