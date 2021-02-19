export type EngineName = "b" | "g";
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

export type Options = { location: LocationName; engine: EngineName };

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

export const engines: EngineName[] = ["g", "b"];

export const defaultOptions: Options = {
  location: "au",
  engine: "g",
};
