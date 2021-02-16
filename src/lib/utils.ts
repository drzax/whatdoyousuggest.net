import { writable } from "svelte/store";

export const location = writable("us");

export const sanitiseTerm = (str: string) =>
  str
    .toLowerCase()
    .replace(/[.,\\/#!$%\\^&\\*;:{}=\-_`~()\\?]/g, "")
    .replace(/\+/g, " ");

export const endpoint = (term: string, location: string) =>
  `/query?q=${encodeURIComponent(term)}&gl=${location}`;

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
