<script lang="ts">
  export let node;
  export let parentBBox: DOMRect;
  export let dx: number;
  export let dy: number;
  let element;
  let width = element && element.getBBox().width;
</script>

<text>{node.term}</text>
{#if parentBBox}
  <rect
    x={parentBBox.x}
    y={parentBBox.y}
    height={parentBBox.height}
    width={parentBBox.width}
  />
{/if}
