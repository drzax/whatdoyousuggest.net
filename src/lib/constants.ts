export const locations: LocationName[] = [
  "ar",
  "au",
  "br",
  "ca",
  "cn",
  "fr",
  "de",
  "in",
  "id",
  "it",
  "jp",
  "mx",
  "ru",
  "sa",
  "za",
  "kr",
  "tr",
  "gb",
  "us",
];

export const engines: { id: EngineId; name: string }[] = [
  { id: "g", name: "Google" },
  { id: "b", name: "Bing" },
  { id: "y", name: "Yahoo" },
  { id: "d", name: "DuckDuckGo" },
];

export const defaultOptions: Options = {
  location: "au",
  engine: "g",
};
