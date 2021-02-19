import { writable } from "svelte/store";
import { defaultOptions, locations, engines } from "$lib/constants";
import type { LocationName, EngineName, Options } from "$lib/constants";

export const location = writable("us");

export const sanitiseTerm = (str: string) =>
  str
    .toLowerCase()
    .replace(/[.,\\/#!$%\\^&\\*;:{}=\-_`~()\\?]/g, "")
    .replace(/\+/g, " ");

export const endpoint = (
  term: string,
  location: LocationName,
  engine: EngineName
) => `/api/${engine}?q=${encodeURIComponent(term)}&l=${location}`;

export const splitOutRootTerms = (suggestions: string[], phrase: string) => {
  const replacer = new RegExp(`(^|\\b)${phrase}(\\B)`);
  return suggestions.map((d) => d.replace(replacer, phrase + " ⇢"));
};

// Slug format: words+separated+by+plus+sign
// Each individual term has been url encoded
export const inputsFromSlug = (slug: string) => {
  const phrase = decodeURIComponent(slug).replace(/\+/g, " ").toLowerCase();
  const term = phrase.trim().split(" ").pop();
  return [phrase, term, slug];
};

export const inputsFromForm = (text: string) => {
  const phrase = sanitiseTerm(text);
  const term = phrase.trim().split(" ").pop();
  const slug = phrase
    .trim()
    .split(" ")
    .map((d) => encodeURIComponent(d))
    .join("+");
  return [phrase, term, slug];
};

export const optionsStringToObject = (str: string = ""): Options => {
  const [l, e] = str.split(":");
  const location = validateLocation(l);
  const engine = validateEngine(e);
  return { location, engine };
};

export const validateLocation = (location: unknown): LocationName => {
  return locations.find((d) => d === location) || null;
};

export const validateEngine = (engine: unknown) => {
  return engines.find((d) => d === engine) || defaultOptions.engine;
};

export const pathToProps = (
  path: string
): { slug: string; location: LocationName; engine: EngineName } => {
  const [slug, optionsString] = path.split("/").filter((d) => !!d);
  const { location, engine } = optionsStringToObject(optionsString);
  return { slug, location, engine };
};

export const getLangByLocation = (location: LocationName) => {
  const langs = {
    ar: "es",
    au: "en",
    br: "pt",
    ca: "en",
    cn: "zh",
    fr: "fr",
    de: "de",
    in: "en",
    id: "id",
    it: "it",
    jp: "jp",
    mx: "es",
    ru: "ru",
    sa: "en",
    za: "en",
    kr: "ko",
    tr: "tr",
    gb: "en",
    us: "us",
  };
  return langs[location];
};
