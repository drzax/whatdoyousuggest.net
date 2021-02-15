<script lang="ts">
  import { scaleLinear } from "d3-scale";
  import unique from "reduce-unique";
  import Node from "$components/Node.svelte";
  export let suggestions: string[];
  export let term: string;

  const createTree = (
    suggestions: string[],
    rootTerm: string
  ): WordTreeData => {
    const nodes = new Map();
    console.log("suggestions :>> ", suggestions);
    suggestions.forEach((phrase, phraseIndex) => {
      let parent: null | WordTreeNode = null;
      phrase.split(" ").forEach((term, i, arr) => {
        console.log("term, rootTerm :>> ", term, rootTerm);
        const level = i - arr.indexOf(rootTerm);
        const key = `${level}-${term}`;
        const termNode: WordTreeNode = nodes.has(key)
          ? nodes.get(key)
          : {
              key,
              term,
              level,
              after: [],
              before: [],
              phrases: [],
            };

        nodes.set(key, termNode);

        if (
          termNode.phrases.find((d) => d.index === phraseIndex) === undefined
        ) {
          termNode.phrases.push({ text: phrase, index: phraseIndex });
        }

        if (parent !== null) {
          if (!parent.after.includes(termNode)) {
            parent.after.push(termNode);
          }

          if (!termNode.before.includes(parent)) {
            termNode.before.push(parent);
          }
        }
        parent = termNode;
      });
    });
    const root = nodes.get(`0-${rootTerm}`);

    const consolidator = (direction: string) => (node) => {
      while (node[direction].length === 1) {
        const next = node[direction][0];
        node.term =
          direction === "after"
            ? `${node.term} ${next.term}`
            : `${next.term} ${node.term}`;
        node[direction] = next[direction];
        // todo: have I broken a link between child nodes here? Does it matter?
        nodes.delete(next.key);
      }
      node[direction].forEach(consolidator(direction));
    };

    root.after.forEach(consolidator("after"));
    root.before.forEach(consolidator("before"));

    const nodesArray: WordTreeNode[] = Array.from(nodes.entries()).map(
      (d) => d[1]
    );

    const splits: [string, string][] = suggestions.map((d) => {
      const split = d.split(rootTerm);
      const prefix = split.shift().trim();
      const suffix = split.join(rootTerm).trim();
      return [prefix, suffix];
    });
    const prefixes = splits.map((d) => d[0]);
    const suffixes = splits.map((d) => d[1]);

    return {
      nodes: nodesArray,
      root,
      suffixCount: suffixes.reduce(unique).length,
      prefixCount: prefixes.reduce(unique).length,
      phraseCount: suggestions.length,
    };
  };

  // todo: handle no suggestions
  let tree: WordTreeData;
  $: tree = createTree(suggestions, term);
  $: console.log("tree :>> ", tree);

  const textHeight = 18;
  const maxFontSize = textHeight * 2;
  $: scale = scaleLinear()
    .range([textHeight, maxFontSize])
    .domain([1, tree.root.phrases.length]);
  let width: number;

  let rootElement: SVGTextElement;
  let rootBBox: DOMRect;
  $: rootBBox = rootElement && rootElement.getBBox();
</script>

<div bind:clientWidth={width} style="position:relative">
  <div class="nodes">
    <Node node={tree.root} {scale} />
  </div>
</div>

<style lang="scss">
  .root {
    font-weight: bold;
    text-anchor: middle;
  }
  .nodes {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
