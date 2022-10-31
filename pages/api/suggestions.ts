import { NextApiRequest, NextApiResponse } from 'next';

const suggestionsEndpoint =
  'https://www.pexels.com/de-de/api/v3/search/suggestions/';

const fetchSuggestions = async (input: string) => {
  const response = await fetch(`${suggestionsEndpoint}/${input}`);
  const data = (await response.json()).data;
  return data.attributes.suggestions;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { term } = req.query;

  if (!term) {
    return res.status(200).json([]);
  }

  const data = await fetchSuggestions(term as string);
  res.status(200).json(data);
}
