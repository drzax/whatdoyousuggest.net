import type { LocationName, EngineId, Options } from "../types";

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
  { id: "yt", name: "YouTube" },
  { id: "br", name: "Brave" },
];

export const defaultOptions: Options = {
  location: "au",
  engine: "g",
};
