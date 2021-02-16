<script lang="ts">
  // Imports!
  import { linkHorizontal } from "d3-shape";
  import { xMaxLeft, xMaxRight } from "$lib/stores";

  // Exports / props
  export let node: WordTreeNode;
  export let scale;
  export let parentTextLength: number = 0;
  export let parentDistanceFromRoot: number = 0;
  export let y = 0;

  // Constants / settings
  const lineHeight: number = 45;
  const linkDistance: number = 100;
  const link = linkHorizontal();

  // Bound vars
  let width: number = 0;

  // Reactive vars
  $: fontSize = scale(node.phrases.length);
  $: before = node.before;
  $: after = node.after;
  $: level = node.level;
  $: isRoot = node.isRoot;

  // Calculate x-axis positioning
  let xDistanceFromRoot: number;
  let textLength: number;
  let xDirection: "right" | "left"; // confusingly, this is a CSS text direction, so nodes to the left of the root have a xDirection of 'right'

  // The length of the text to account for in the layout
  $: textLength = isRoot ? width / 2 : width;

  // CSS props
  $: xDirection = level < 0 ? "right" : "left";
  $: xDistance = isRoot
    ? Math.max(width / 2, $xMaxRight) + 30
    : parentTextLength + linkDistance;
  $: xUnit = isRoot ? "px" : "px";
  $: xStyle = `${xDirection}:${xDistance}${xUnit}`;

  // Record the cumulative distance of this branch from the root node
  $: xDistanceFromRoot =
    parentDistanceFromRoot + parentTextLength + (isRoot ? 0 : linkDistance);

  // Update the maximum extent of all branches in this direction
  $: (xDirection === "left" ? xMaxLeft : xMaxRight).update((v) => {
    return Math.max(xDistanceFromRoot + textLength + 30, v);
  });

  // $: if (isRoot && textLength > 0) xMaxRight.set(textLength);
  // $: if (isRoot && textLength > 0) xMaxLeft.set(textLength);

  // Calculate y-axis positioning

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

  $: yDistance = y + (node.phrases.length * lineHeight) / 2;
  $: yStyle = `top: ${yDistance}px`;

  $: afterHeight = after.reduce(heightReducer, 0);
  $: beforeHeight = before.reduce(heightReducer, 0);
</script>

<div
  class={`node ${isRoot ? "root" : level < 0 ? "left" : "right"}`}
  style={`font-size: ${fontSize}px; ${xStyle}; ${yStyle}; opacity: ${
    width ? 1 : 1
  }`}
>
  <!-- term -->
  <div class="term" bind:clientWidth={width}>{node.term}</div>

  <!-- link -->
  {#if !isRoot}
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
        parentTextLength={textLength}
        parentDistanceFromRoot={xDistanceFromRoot}
        y={-afterHeight / 2 + afterYPositions[i]}
      />
    {/each}
  {/if}

  {#if level <= 0 && before.length}
    {#each before as node, i}
      <svelte:self
        {node}
        {scale}
        parentTextLength={textLength}
        parentDistanceFromRoot={xDistanceFromRoot}
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
    transition: opacity 0.2s;
    opacity: 0;
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
