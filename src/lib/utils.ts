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

const splitOnRootTerm = (
  suggestions: string[],
  rootTerm: string | undefined
) => {
  return suggestions.map((suggestion) => {
    const terms = suggestion.normalize("NFC").split(" ");

    if (typeof rootTerm === "undefined") {
      return terms;
    }

    if (typeof terms.find((d) => d === rootTerm) === "undefined") {
      let start: number = 0;

      const containsIndex = terms.findIndex(
        (d) => (start = d.indexOf(rootTerm)) > -1
      );

      if (containsIndex > -1) {
        const term = terms[containsIndex];

        let replacements: string[];

        if (start === 0) {
          replacements = [rootTerm, "⇢" + term.substring(rootTerm.length)];
        } else if (start + rootTerm.length === term.length) {
          replacements = [term.substring(0, start) + "⇢", rootTerm];
        } else {
          replacements = [
            term.substring(0, start) + "⇢",
            rootTerm,
            "⇢" + term.substring(start + rootTerm.length),
          ];
        }
        terms.splice(containsIndex, 1, ...replacements);
      }
    }

    return terms;
  });
};

export const normaliseSuggestionData = (
  suggestions: string[],
  phrase: string
): [string[], string | undefined] => {
  const terms = phrase.normalize("NFC").trim().split(" ");
  let rootTerm = terms.pop();

  let splitSuggestions = splitOnRootTerm(suggestions, rootTerm);

  while (
    terms.length &&
    splitSuggestions.filter(
      (d) => typeof d.find((d) => d === rootTerm) !== "undefined"
    ).length === 0
  ) {
    rootTerm = terms.pop();
    splitSuggestions = splitOnRootTerm(suggestions, rootTerm);
  }

  return [splitSuggestions.map((d) => d.join(" ")), rootTerm];
};

// Slug format: words+separated+by+plus+sign
// Each individual term has been url encoded
export const slugToPhrase = (slug: string) => {
  return decodeURIComponent(slug).replace(/\+/g, " ").toLowerCase();
};

export const inputsFromForm = (text: string) => {
  const phrase = sanitiseTerm(text);
  const slug = phrase.split(" ").map(encodeURIComponent).join("+");
  return [phrase, slug];
};

export const optionsStringToObject = (str: string = ""): Options => {
  const [l, e] = str.split(":");
  const location = validateLocation(l);
  const engine = validateEngine(e);
  return { location, engine };
};

export const validateLocation = (location: unknown): LocationName =>
  locations.find((d) => d === location) || defaultOptions.location;

export const validateEngine = (engineId: unknown) =>
  engines.find((d) => d.id === engineId)?.id || defaultOptions.engine;

export const pathToProps = (
  path: string
): { slug: string; location: LocationName | null; engine: EngineId } => {
  const [, slug, optionsString] = path.split("/");
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
