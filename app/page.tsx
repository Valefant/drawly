'use client';

import Image from 'next/image';
import bgImage from '../public/tile_background.png';
import { useDebounce } from 'usehooks-ts';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Select from 'react-select';
import { playfulButtonDesign } from '../components/design';

function useSuggestions(searchTerm: string): {
  suggestions: string[];
  isLoading: boolean;
} {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (searchTerm === '') {
      return;
    }

    setIsLoading(true);
    fetchSuggestions(searchTerm)
      .then((suggestions) => setSuggestions(suggestions))
      .finally(() => setIsLoading(false));
  }, [searchTerm]);

  return { suggestions, isLoading };
}

async function fetchSuggestions(searchTerm: string): Promise<string[]> {
  const response = await fetch(`api/suggestions?term=${searchTerm}`);
  return await response.json();
}

export default function Home() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 250);
  const { suggestions, isLoading } = useSuggestions(debouncedSearchTerm);
  const suggestionOptions = suggestions.map((e) => ({ label: e, value: e }));
  const [startDrawingSession, setStartDrawingSession] = useState(false);

  return (
    <div className="relative h-screen">
      <Image src={bgImage} alt="background" className="absolute h-full" />
      <div className="relative flex flex-col items-center justify-center h-full space-y-8">
        <h1 className="text-5xl font-bold">Drawly</h1>
        <div className="w-96">
          {!startDrawingSession && (
            <Select
              name="suggestions"
              isLoading={isLoading}
              options={suggestionOptions}
              classNamePrefix="select"
              onInputChange={(input) => {
                setSearchTerm(input);
              }}
              onChange={(option) => {
                setSelectedOption(option?.value ?? '');
              }}
              placeholder={'Type for suggestions...'}
              isClearable={true}
              noOptionsMessage={() =>
                'We could not find any related images for your search'
              }
            />
          )}
          {startDrawingSession && (
            <div className="flex justify-center">
              Starting drawing session...
            </div>
          )}
        </div>
        <button
          {...playfulButtonDesign}
          disabled={selectedOption === ''}
          onClick={async () => {
            setStartDrawingSession(true);
            await router.push(`draw/${selectedOption}`);
          }}
        >
          Start
        </button>
        <a className="underline opacity-50" href="https://www.pexels.com">
          Photos provided by Pexels
        </a>
      </div>
    </div>
  );
}
