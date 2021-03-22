<script lang="ts">
  import Header from "$lib/Header.svelte";
  export let error: Error;
</script>

<Header />

<main>
  <h1>Error and Loss</h1>
  <p>By William Morris</p>

  Upon an eve I sat me down and wept,
  <br />Because the world to me seemed nowise good;
  <br />Still autumn was it, &amp; the meadows slept,
  <br />The misty hills dreamed, and the silent wood
  <br />Seemed listening to the sorrow of my mood:
  <br />I knew not if the earth with me did grieve,
  <br />Or if it mocked my grief that bitter eve.
  <br />
  <br />Then ’twixt my tears a maiden did I see,
  <br />Who drew anigh me on the leaf-strewn grass,
  <br />Then stood and gazed upon me pitifully
  <br />With grief-worn eyes, until my woe did pass
  <br />From me to her, and tearless now I was,
  <br />And she mid tears was asking me of one
  <br />She long had sought unaided and alone.
  <br />
  <br />I knew not of him, and she turned away
  <br />Into the dark wood, and my own great pain
  <br />Still held me there, till dark had slain the day,
  <br />And perished at the grey dawn’s hand again;
  <br />Then from the wood a voice cried: “Ah, in vain,
  <br />In vain I seek thee, O thou bitter-sweet!
  <br />In what lone land are set thy longed-for feet?”
  <br />
  <br />Then I looked up, and lo, a man there came
  <br />From midst the trees, and stood regarding me
  <br />Until my tears were dried for very shame;
  <br />Then he cried out: “O mourner, where is she
  <br />Whom I have sought o’er every land and sea?
  <br />I love her and she loveth me, and still
  <br />We meet no more than green hill meeteth hill.”
  <br />
  <br />With that he passed on sadly, and I knew
  <br />That these had met and missed in the dark night,
  <br />Blinded by blindness of the world untrue,
  <br />That hideth love and maketh wrong of right.
  <br />Then midst my pity for their lost delight,
  <br />Yet more with barren longing I grew weak,
  <br />Yet more I mourned that I had none to seek.
  <br />
  <hr />
  <p>But all is not lost, you can <a href="/">go home</a> and try again.</p>
</main>

<style lang="scss">
  main {
    max-width: 40em;
    margin: 3rem auto;
    padding: 0 40px;
    text-align: center;
  }
</style>
