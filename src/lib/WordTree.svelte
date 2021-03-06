<script lang="ts">
  // Imports
  import type { WordTreeNode, WordTreeData } from "../types";
  import { scaleLinear, scaleOrdinal } from "d3-scale";
  import { schemeCategory10 } from "d3-scale-chromatic";

  import unique from "reduce-unique";
  import { xMaxLeft, xMaxRight } from "$lib/stores";

  // Components
  import Branch from "$lib/Branch.svelte";

  // exports / props
  export let suggestions: string[]; // An array of phrases
  export let term: string; // the search term

  $: if (suggestions) {
    xMaxRight.set(0);
    xMaxLeft.set(0);
  }

  const createTree = (
    suggestions: string[],
    rootTerm: string
  ): WordTreeData => {
    const nodes = new Map();
    const unconnected: string[] = [];
    suggestions.forEach((phrase, phraseIndex) => {
      const terms = phrase.split(" ");
      const rootIndex = terms.indexOf(rootTerm);
      if (rootIndex === -1) {
        unconnected.push(phrase);
        return;
      }

      let parent: null | WordTreeNode = null;
      terms.forEach((term, i, arr) => {
        const level = i - rootIndex;
        const isRoot = level === 0;
        const key =
          level < 0
            ? arr.slice(rootIndex + level, rootIndex + 1).join("-")
            : level === 0
            ? term
            : arr.slice(rootIndex, rootIndex + level + 1).join("-");

        const termNode: WordTreeNode = nodes.has(key)
          ? nodes.get(key)
          : {
              key,
              term,
              level,
              isRoot,
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

    const nodesArray: WordTreeNode[] = Array.from(nodes.entries()).map(
      (d) => d[1]
    );

    const root: WordTreeNode = nodesArray.find((d) => d.isRoot) || {
      key: "root",
      term: rootTerm,
      level: 0,
      after: [],
      before: [],
      phrases: [],
      isRoot: true,
    };

    const consolidator = (direction: "before" | "after") => (
      node: WordTreeNode
    ) => {
      while (
        // There is only a single link so maybe it can be consolidated
        node[direction].length === 1 &&
        // But not if this term is the last term in one or more of its phrases
        typeof node.phrases.find(
          ({ text }) =>
            text.lastIndexOf(node.term) === text.length - node.term.length
        ) === "undefined"
      ) {
        const next = node[direction][0];
        node.term =
          direction === "after"
            ? `${node.term} ${next.term}`
            : `${next.term} ${node.term}`;
        node[direction] = next[direction];
        next.phrases.forEach((d) => {
          if (
            typeof node.phrases.find((f) => f.index === d.index) === "undefined"
          ) {
            node.phrases.push(d);
          }
        });

        // todo: have I broken a link between child nodes here? Does it matter?
        nodes.delete(next.key);
      }
      node[direction].forEach(consolidator(direction));
    };

    root.after.forEach(consolidator("after"));
    root.before.forEach(consolidator("before"));

    const splits: [string, string][] = suggestions.map((d) => {
      const split = d.split(rootTerm);
      const prefix = split.shift().trim();
      const suffix = split.join(rootTerm).trim();
      return [prefix, suffix];
    });
    const prefixes = splits.map((d) => d[0]);
    const suffixes = splits.map((d) => d[1]);

    return {
      nodes: nodesArray, // TODO: this isn't really used anywhere, but it also contains nodes that were discarded during consolidation
      root,
      unconnected,
      suffixCount: suffixes.reduce(unique).length,
      prefixCount: prefixes.reduce(unique).length,
      phraseCount: suggestions.length,
    };
  };

  // todo: handle no suggestions
  let root: WordTreeNode;
  let scaleLinks = scaleOrdinal<string>(schemeCategory10);
  let tree = createTree(suggestions, term);
  $: root = tree.root;
  $: unconnected = tree.unconnected;
  $: scale = scaleLinear().range([24, 40]).domain([1, root.phrases.length]);
  $: scaleLinks.domain(root.phrases.map((d) => String(d.index)));
  const lineHeight = 45;

  $: treeHeight = root.phrases.length * lineHeight + 50;
  $: treeWidth = $xMaxLeft + $xMaxRight + 60;
</script>

<div class="container">
  <div class="tree" style={`width: ${treeWidth}px; height:${treeHeight}px`}>
    <Branch node={root} {scale} {scaleLinks} />
  </div>
  {#if unconnected.length}
    <details class="unconnected">
      <summary>Suggestions that don't match the search term</summary>
      <ul>
        {#each unconnected as phrase}<li>{phrase}</li>{/each}
      </ul>
    </details>
  {/if}
</div>

<style lang="scss">
  .container {
    width: 100%;
    position: relative;
    overflow-x: auto;
    height: 100%;
  }
  .tree {
    position: relative;
    margin: 0 auto;
  }
  .unconnected {
    text-align: center;
    color: #999;
    ul {
      margin: 1rem 0;
      padding: 0;
    }
    li {
      margin: 0.3rem 0;
      padding: 0;
      line-height: 1.1;
      list-style-type: none;
      font-size: 1.3rem;
    }
  }
</style>
