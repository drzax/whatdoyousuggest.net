import { writable } from "svelte/store";

export const location = writable("us");

// export const url2input = (str: string) =>
//   decodeURIComponent(str).replace(/\+/g, " ");

// export const input2url = (str: string) =>
//   str.split(" ").map(encodeURIComponent).join("+");

export const sanitiseTerm = (str: string) =>
  str
    .toLowerCase()
    .replace(/[.,\\/#!$%\\^&\\*;:{}=\-_`~()\\?]/g, "")
    .replace(/\+/g, " ");

export const endpoint = (term: string, location: string) =>
  `/query?q=${encodeURIComponent(term)}&gl=${location}`;

export const splitOutRootTerms = (suggestions: string[], phrase: string) => {
  const replacer = new RegExp(`(^|\\b)${phrase}(\\B)`);
  return suggestions.map((d) => d.replace(replacer, phrase + " ⇢ "));
};

// export const getRootTerm = (input: string) => ;

// Slug format: words+separated+by+plus+sign
// Each individual term has been url encoded
export const inputsFromSlug = (slug: string) => {
  const phrase = decodeURIComponent(slug).replace(/\+/g, " ").toLowerCase();
  const term = phrase.trim().split(" ").pop();
  return [phrase, term, slug];
};
