import { writable } from "svelte/store";
import { defaultOptions, locations, engines } from "$lib/constants";
import type { LocationName, EngineId, Options } from "../types";

export const location = writable("us");

export const sanitiseTerm = (str: string) =>
  str
    .toLowerCase()
    .replace(/[.,\\/#!$%\\^&\\*;:{}=\-_`~()\\?]/g, "")
    .replace(/\+/g, " ");

export const endpoint = (
  term: string,
  location: LocationName,
  engine: EngineId
) => `/api/${engine}?q=${encodeURIComponent(term)}&l=${location}`;

export const splitOutRootTerms = (suggestions: string[], phrase: string) => {
  const hasRootTermFilter = (t: string) => t.split(" ").indexOf(phrase) > -1;
  const noRootTermFilter = (t: string) => t.split(" ").indexOf(phrase) === -1;

  let hasRootTerm = suggestions.filter(hasRootTermFilter);
  let remainingPhrases = suggestions.filter(noRootTermFilter);
  let modified: string[] = [];

  // Simple prefixes
  const prefixReplacer = new RegExp(`(^|\\b)${phrase}(\\B)`);
  modified = remainingPhrases.map((d) =>
    d.replace(prefixReplacer, phrase + " ⇢")
  );
  hasRootTerm = hasRootTerm.concat(modified.filter(hasRootTermFilter));
  remainingPhrases = modified.filter(noRootTermFilter);

  // Apostrophe
  const apostropheReplacer = new RegExp(`(^|\\b)${phrase}'`);
  modified = remainingPhrases.map((d) =>
    d.replace(apostropheReplacer, phrase + " ⇢'")
  );
  hasRootTerm = hasRootTerm.concat(modified.filter(hasRootTermFilter));
  remainingPhrases = modified.filter(noRootTermFilter);

  // Simple suffixes
  const suffixReplacer = new RegExp(`(\\B)${phrase}(\\b|$)`);
  modified = remainingPhrases.map((d) =>
    d.replace(suffixReplacer, "⇢ " + phrase)
  );
  hasRootTerm = hasRootTerm.concat(modified.filter(hasRootTermFilter));
  remainingPhrases = modified.filter(noRootTermFilter);

  // Middle
  const middleReplacer = new RegExp(`(\\B)${phrase}(\\B)`);
  modified = remainingPhrases.map((d) =>
    d.replace(middleReplacer, "⇢ " + phrase + " ⇢")
  );
  hasRootTerm = hasRootTerm.concat(modified.filter(hasRootTermFilter));
  remainingPhrases = modified.filter(noRootTermFilter);

  // TODO: log the remaining terms and figure out how to display them

  return hasRootTerm;
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
  const slug = phrase.split(" ").map(encodeURIComponent).join("+");
  return [phrase, term, slug];
};

export const optionsStringToObject = (str: string = ""): Options => {
  const [l, e] = str.split(":");
  const location = validateLocation(l);
  const engine = validateEngine(e);
  return { location, engine };
};

export const validateLocation = (location: unknown): LocationName =>
  locations.find((d) => d === location) || null;

export const validateEngine = (engineId: unknown) =>
  engines.find((d) => d.id === engineId)?.id || defaultOptions.engine;

export const pathToProps = (
  path: string
): { slug: string; location: LocationName; engine: EngineId } => {
  const [slug, optionsString] = path.split("/");
  const { location, engine } = optionsStringToObject(optionsString);
  return {
    slug: slug.split("+").map(decodeURIComponent).join(" "),
    location,
    engine,
  };
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

export const obj2search = (obj) =>
  Object.keys(obj)
    .map((key) => `${key}=${obj[key]}`)
    .join("&");
