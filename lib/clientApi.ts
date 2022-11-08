export async function fetchSuggestions(searchTerm: string): Promise<string[]> {
  const response = await fetch(`api/suggestions?term=${searchTerm}`);
  return await response.json();
}

type Theme = 'light' | 'dark';
export async function saveThemePreference(theme: Theme): Promise<void> {
  await fetch(`/api/preferences?theme=${theme}`);
  return;
}
