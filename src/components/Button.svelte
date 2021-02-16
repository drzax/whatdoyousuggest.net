<button on:click>
  <slot />
</button>

<style lang="scss">
  button {
    border: 1px solid #ccc;
    padding: 0.5rem 2rem;
    border-radius: 4px;
    font-weight: bold;

    &:hover {
      background-color: #ddd;
    }
  }
</style>
