export type WordTreeData = {
  nodes: WordTreeNode[];
  root: WordTreeNode;
  suffixCount: number;
  prefixCount: number;
  phraseCount: number;
};

export type WordTreeNode = {
  key: string;
  term: string;
  level: number;
  after: WordTreeNode[];
  before: WordTreeNode[];
  phrases: { text: string; index: number }[];
  isRoot: boolean;
};

export type EngineId = "b" | "g" | "d" | "y";
export type Engine = { id: EngineId; name: string };
export type LocationName =
  | "ar"
  | "au"
  | "br"
  | "ca"
  | "cn"
  | "fr"
  | "de"
  | "in"
  | "id"
  | "it"
  | "jp"
  | "mx"
  | "ru"
  | "sa"
  | "za"
  | "kr"
  | "tr"
  | "gb"
  | "us";

export type Options = { location: LocationName; engine: EngineId };