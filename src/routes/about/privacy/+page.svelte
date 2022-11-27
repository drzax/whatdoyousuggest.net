<script lang="ts">
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

<h1>Privacy Policy</h1>
<p>
  This site collects a small amount of data, mostly about errors and how people
  use it. This document describes what data is collected and how it's used.
</p>
<h2>Who operates this site?</h2>
<p>
  This site is an experiment built and maintained as a hobby by me, <a
    href="https://elvery.net">Simon Elvery</a
  >.
</p>
<h2>Identifying data and web tracking</h2>
<p>
  This site does not collect your personal details. I don't know, or want to
  know, who you are.
</p>
<p>
  This site does not use cookies from any third parties or include any
  third-party scripts that transmit data about you or your use of the site
  beyond what is mentioned below.
</p>
<h2>Location</h2>
<p>
  If you have not previously selected a location, or have cleared your browser's
  local storage since doing so, this site attempts to detect the country you're
  in using a third-party service called <a href="https://ipstack.com"
    >ipstack.com</a
  > in order to provide more relevant results.
</p>
<p>
  The information returned by ipstack is not retained beyond use of a two letter
  country code for the duration of your visit to the site. You can effectively
  opt-out of future use of this service by manually selecting a country.
</p>
<p>Read <a href="https://ipstack.com/privacy">ipstack's Privacy Policy</a>.</p>

<h2>Access logs</h2>
<p>My hosting provider, Netlify, logs access to this site.</p>
<p>
  Netlify stores your IP addresses for up to 30 days after visiting this site.
  This data is used for networking analytics, and is not combined with any other
  identifying data. You can read more about Netlify's <a
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
    Further, you can opt out of error reporting. This preference will be stored
    in your browser's local storage and so apply in this browser only and will
    no longer apply if your browser's local storage is cleared.
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
<h2>Research potential</h2>
<p>
  At some point in the future, I may start collecting search terms entered into
  this site and the suggestions provided by search engines in response.
</p>
<p>
  The purpose of this hypothetical data collection would be to analyse how
  suggestions made by search engines change over time.
</p>
<p>
  If and when this data starts being collected, this privacy policy will be
  updated to reflect the change.
</p>
<h2>Questions?</h2>
<p>
  Feel free to <a href="https://elvery.net/drzax/about">get in touch</a> if you have
  any questions.
</p>
<hr />
<p>Last updated on 22 March 2021.</p>
