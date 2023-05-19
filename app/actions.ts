'use server';

import { cookies } from 'next/headers';

const suggestionsEndpoint =
  'https://www.pexels.com/de-de/api/v3/search/suggestions/';

export const loadSuggestions = async (input: string) => {
  const response = await fetch(`${suggestionsEndpoint}/${input}`);
  const data = (await response.json()).data;
  return data.attributes.suggestions;
};

export type Theme = 'light' | 'dark';

export async function setTheme(theme: Theme) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  cookies().set('theme', theme);
}

export async function lookupTheme(): Promise<Theme> {
  return cookies().get('theme')?.value as Theme;
}
