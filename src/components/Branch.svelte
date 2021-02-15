<script lang="ts">
  import { linkHorizontal } from "d3-shape";
  export let node: WordTreeNode;
  export let scale;
  export let parentX: number;
  export let parentY: number;
  export let y = 0;

  let width: number;

  const lineHeight: number = 40;

  $: fontSize = scale(node.phrases.length);
  $: before = node.before;
  $: after = node.after;
  $: level = node.level;

  const link = linkHorizontal();

  const caluclateChildYPositions = (children) => {
    const positions = [];
    let y = 0;
    children.forEach((child) => {
      positions.push(y);
      y += child.phrases.length * lineHeight;
    });
    return positions;
  };

  const heightReducer = (t: number, d: WordTreeNode): number =>
    t + d.phrases.length * lineHeight;

  $: beforeYPositions = caluclateChildYPositions(before);
  $: afterYPositions = caluclateChildYPositions(after);

  $: xDirection = level < 0 ? "right" : "left";
  $: xDistance = level === 0 ? 50 : parentX + 100;
  $: xUnit = level === 0 ? "%" : "px";
  $: xStyle = `${xDirection}:${xDistance}${xUnit};`;

  $: yDistance = y + (node.phrases.length * lineHeight) / 2;
  $: yStyle = `top: ${yDistance}px`;

  $: afterHeight = after.reduce(heightReducer, 0);
  $: beforeHeight = before.reduce(heightReducer, 0);

  const getY = (child) => {
    if (level === 0) {
      return (lineHeight * node.phrases.length) / 2;
    }

    return 0;
  };
</script>

<div
  class={`node ${level < 0 ? "left" : level > 0 ? "right" : "root"}`}
  style={`font-size: ${fontSize}px; ${xStyle} ${yStyle}`}
>
  <!-- term -->
  <div class="term" bind:clientWidth={width}>{node.term}</div>

  <!-- link -->
  {#if level !== 0}
    <svg
      class={`${level < 0 ? "left" : "right"} ${yDistance < 0 ? "up" : "down"}`}
      width={100}
      height={Math.abs(yDistance) + 40}
    >
      <path
        class="link"
        d={link({
          source: [
            level < 0 ? 95 : 5,
            (yDistance > 0 ? 0 : Math.abs(yDistance)) + 20,
          ],
          target: [
            level < 0 ? 5 : 95,
            (yDistance > 0 ? Math.abs(yDistance) : 0) + 20,
          ],
        })}
      />
    </svg>
  {/if}

  <!-- children -->
  {#if level >= 0 && after.length}
    {#each after as node, i}
      <svelte:self
        {node}
        {scale}
        parentX={level === 0 ? width / 2 : width}
        parentY={yDistance}
        y={-afterHeight / 2 + afterYPositions[i]}
      />
    {/each}
  {/if}

  {#if level <= 0 && before.length}
    {#each before as node, i}
      <svelte:self
        {node}
        {scale}
        parentX={level === 0 ? width / 2 : width}
        parentY={yDistance}
        y={-beforeHeight / 2 + beforeYPositions[i]}
      />
    {/each}
  {/if}
</div>

<style lang="scss">
  svg {
    position: absolute;
    &.right {
      right: 0;
    }

    &.left {
      left: 0;
    }

    &.up {
      top: -20px;
    }

    &.down {
      bottom: -20px;
    }

    .link {
      fill: none;
      stroke: #ccc;
      stroke-width: 2;
    }
  }
  .term {
    position: absolute;
    white-space: nowrap;
    transform: translate(-50%, -50%);
    font-family: Helvetica, Arial, sans-serif;
  }
  .node {
    position: absolute;
  }
  .next,
  .prev {
    position: absolute;
  }

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
