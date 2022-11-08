'use client';

import { useEffect, useState } from 'react';
import { fetchSuggestions, saveThemePreference } from '../lib/clientApi';
import { useRouter } from 'next/navigation';
import { useDebounce } from 'usehooks-ts';
import Image from 'next/image';
import bgImage from '../public/tile_background.png';
import SunIcon from '@heroicons/react/24/solid/SunIcon';
import MoonIcon from '@heroicons/react/24/solid/MoonIcon';
import Select from 'react-select';
import { playfulButton } from '../components/design';

function useSuggestions(searchTerm: string): {
  suggestions: string[];
  suggestionsLoading: boolean;
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

  return { suggestions, suggestionsLoading: isLoading };
}

const imageCountOptions = [5, 10, 15];
const timerDurationOptions = [1, 3, 5];

export default function TitleScreen({ categories }: { categories: string[] }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 250);
  const { suggestions, suggestionsLoading } =
    useSuggestions(debouncedSearchTerm);
  const suggestionOptions = (searchTerm === '' ? categories : suggestions).map(
    (e) => ({ label: e, value: e })
  );
  const [startingDrawingSession, setStartingDrawingSession] = useState(false);
  const [imageCount, setImageCount] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const startEnabled =
    selectedOption != '' && imageCount != null && duration != null;

  const groupedOptions = [
    {
      label: searchTerm === '' ? 'Recently drawn by others' : 'Categories',
      options: suggestionOptions,
    },
  ];

  return (
    <div className="dark:bg-neutral-800 dark:text-white relative h-screen bg-gray-100">
      <Image
        src={bgImage}
        alt="background"
        className="dark:brightness-[.25] opacity-10 brightness-75 absolute h-full"
        style={{
          objectFit: 'cover',
        }}
        quality={100}
      />
      <div className="relative flex flex-col items-center justify-center h-full space-y-8">
        <div className="flex space-x-4">
          <button
            title="Light mode"
            onClick={() => {
              saveThemePreference('light');
              document?.querySelector('html')?.classList.remove('dark');
            }}
          >
            <SunIcon className="aspect-square dark:text-white w-4 text-black" />
          </button>
          <button
            title="Dark mode"
            onClick={() => {
              saveThemePreference('dark');
              document?.querySelector('html')?.classList.add('dark');
            }}
          >
            <MoonIcon className="aspect-square dark:text-white w-4 text-black" />
          </button>
        </div>
        <h1 className="text-5xl font-bold">Drawly</h1>
        {startingDrawingSession && (
          <div className="flex justify-center">Starting drawing session...</div>
        )}
        <div className="w-[22rem]">
          <Select
            name="suggestions"
            isLoading={suggestionsLoading}
            options={groupedOptions}
            className="react-select-container"
            classNamePrefix="react-select"
            onInputChange={(input) => {
              setSearchTerm(input);
            }}
            onChange={(option) => {
              setSelectedOption(
                // ugly hack because the option variable is not properly typed making use of the grouped options
                (option as unknown as { label: string; value: string }).value
              );
            }}
            placeholder={'Type for suggestions...'}
            isClearable={true}
            noOptionsMessage={() =>
              'We could not find any related categories for your search'
            }
          />
        </div>
        <div className="flex flex-col items-center space-y-4">
          <h3>How many images you want to draw?</h3>
          <div className="flex space-x-4">
            {imageCountOptions.map((value) => (
              <button
                key={value}
                onClick={() => setImageCount(value)}
                className={playfulButton({
                  intent: imageCount === value ? 'active' : 'primary',
                })}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center space-y-4">
          <h3>Draw time for each image (in minutes)</h3>
          <div className="flex space-x-4">
            {timerDurationOptions.map((value) => (
              <button
                key={value}
                onClick={() => setDuration(value)}
                className={playfulButton({
                  intent: duration === value ? 'active' : 'primary',
                })}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
        <button
          className={playfulButton({
            intent: startEnabled ? 'primary' : 'disabled',
          })}
          disabled={!startEnabled || startingDrawingSession}
          onClick={async () => {
            setStartingDrawingSession(true);
            await router.push(
              `draw/${selectedOption}?imageCount=${imageCount}&duration=${duration}`
            );
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
