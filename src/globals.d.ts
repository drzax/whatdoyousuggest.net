/// <reference types="@sveltejs/kit" />

//#region Ensure Svelte file endings have a type for TypeScript
/**
 * These declarations tell TypeScript that we allow import of Svelte files in TS files, e.g.
 * ```
		import Component from './Component.svelte';
	 ```
 */
declare module '*.svelte' {
	export { SvelteComponent as default } from 'svelte';
}
//#endregion

//#region Ensure image file endings have a type for TypeScript
/**
 * These declarations tell TypeScript that we allow import of images, e.g.
 * ```
		<script lang='ts'>
			import successkid from 'images/successkid.jpg';
		</script>
		<img src="{successkid}">
	 ```
 */
declare module "*.gif" {
	const value: string;
	export = value;
}

declare module "*.jpg" {
	const value: string;
	export = value;
}

declare module "*.jpeg" {
	const value: string;
	export = value;
}

declare module "*.png" {
	const value: string;
	export = value;
}

declare module "*.svg" {
	const value: string;
	export = value;
}

declare module "*.webp" {
	const value: string;
	export = value;
}
//#endregion


type WordTreeData = {
  nodes: WordTreeNode[];
  root: WordTreeNode;
  suffixCount: number;
  prefixCount: number;
  phraseCount: number;
};

type WordTreeNode = {
  key: string;
  term: string;
  level: number;
  after: WordTreeNode[];
  before: WordTreeNode[];
  phrases: { text: string; index: number }[];
  isRoot: boolean;
};
