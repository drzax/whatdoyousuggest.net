<script lang="ts">
  export let node;
  export let scale;
  export let parentX;
  export let y = 0;
  export let cls = "root";

  let width;

  const lineHeight = 36;

  $: fontSize = scale(node.phrases.length);

  const getX = (level, x, width) => {
    if (level > 0) {
      return `left: ${x + 100}px`;
    }
    if (level < 0) {
      return `right: ${x + 100}px`;
    }
    return `left: 50%`;
  };

  const caluclateChildYPositions = (children) => {
    const positions = [];
    let y = 0;
    children.forEach((child) => {
      positions.push(y);
      y += child.phrases.length * lineHeight;
    });
    return positions;
  };

  $: beforeYPositions = caluclateChildYPositions(node.before);
  $: afterYPositions = caluclateChildYPositions(node.after);

  $: xPosition = getX(node.level, parentX, width);

  const getY = (child) => {
    if (node.level === 0) {
      return (lineHeight * node.phrases.length) / 2;
    }

    return 0;
  };
</script>

<div
  class={`node ${cls}`}
  style={`font-size: ${fontSize}px; ${xPosition}; top: ${
    y + (node.phrases.length * lineHeight) / 2
  }px;`}
>
  <div class="term" bind:clientWidth={width}>{node.term}</div>

  {#if node.level >= 0}
    <div
      class="next"
      style={`top: -${
        node.after.reduce((t, d) => t + d.phrases.length * lineHeight, 0) / 2
      }px`}
    >
      {#each node.after as next, i}
        <svelte:self
          cls="right"
          node={next}
          {scale}
          parentX={node.level === 0 ? width / 2 : width}
          y={afterYPositions[i]}
        />
      {/each}
    </div>
  {/if}

  {#if node.level <= 0}
    <div
      class="prev"
      style={`top: -${
        node.before.reduce((t, d) => t + d.phrases.length * lineHeight, 0) / 2
      }px`}
    >
      {#each node.before as next, i}
        <svelte:self
          cls="left"
          node={next}
          {scale}
          parentX={node.level === 0 ? width / 2 : width}
          y={beforeYPositions[i]}
        />
      {/each}
    </div>
  {/if}
</div>

<style lang="scss">
  .term {
    position: absolute;
    white-space: nowrap;
    transform: translate(-50%, -50%);
  }
  .node {
    position: absolute;
  }
  .next,
  .prev {
    position: absolute;
  }
  /* .next {
    left: calc(100% + 100px);
  }
  .prev {
    right: calc(100% + 100px);
  } */

  .right {
    .term {
      transform: translate(0, -50%);
    }
  }

  .left {
    .term {
      transform: translate(-100%, -50%);
    }
  }
</style>
