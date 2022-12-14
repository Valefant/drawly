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
import { playfulButton } from './components/design';
import pkg from '../package.json';
import { DrawingMode } from '../lib/domainTypes';

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

const categoriesToSelectFrom = [
  'animal',
  'boxing',
  'car',
  'cat',
  'dancing',
  'dog',
  'figure',
  'fitness',
  'flower',
  'fruit',
  'hand',
  'jump',
  'martial arts',
  'model',
  'motorcycle',
  'parkour',
  'portrait',
  'pose',
  'robot',
  'skating',
  'sport',
  'tree',
  'vase',
];
const drawingModeOptions = ['reference', 'memory'] as DrawingMode[];
const numberOfImagesOptions = [5, 10, 15];
const timerDurationOptions = [1, 3, 5];

function random<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

function toOption<T>(value: T): { label: T; value: T } {
  return { label: value, value };
}

export default function TitleScreen({ categories }: { categories: string[] }) {
  const router = useRouter();
  const version = pkg.version;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryOption, setSelectedCategoryOption] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const selectedCategory = selectedCategoryOption?.value;
  const debouncedSearchTerm = useDebounce(searchTerm, 250);
  const { suggestions, suggestionsLoading } =
    useSuggestions(debouncedSearchTerm);
  const suggestionOptions = (searchTerm === '' ? categories : suggestions).map(
    (e) => ({ label: e, value: e })
  );
  const [startingDrawingSession, setStartingDrawingSession] = useState(false);
  const [numberOfImages, setNumberOfImages] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [drawingMode, setDrawingMode] = useState<DrawingMode>('reference');
  const startEnabled =
    selectedCategory && numberOfImages != null && duration != null;

  const groupedOptions = [
    {
      label: searchTerm === '' ? 'Recently drawn by others' : 'Categories',
      options: suggestionOptions,
    },
  ];

  const randomSettings = () => {
    setSelectedCategoryOption(toOption(random(categoriesToSelectFrom)));
    setDrawingMode(random(drawingModeOptions));
    setNumberOfImages(random(numberOfImagesOptions));
    setDuration(random(timerDurationOptions));
  };

  return (
    <div className="dark:bg-neutral-800 dark:text-white relative bg-gray-100">
      <Image
        src={bgImage}
        alt="background"
        className="dark:brightness-[.25] opacity-10 brightness-75 absolute h-full"
        style={{
          objectFit: 'cover',
        }}
        quality={100}
      />

      <div className="relative z-10 flex items-center justify-end h-8 p-4 space-x-2">
        <button
          title="Light mode"
          onClick={() => {
            saveThemePreference('light');
            document?.querySelector('html')?.classList.remove('dark');
          }}
          className="dark:border-white border-[1px] p-1 border-black rounded-full"
        >
          <SunIcon className="aspect-square dark:text-white w-4 text-black" />
        </button>
        <button
          title="Dark mode"
          onClick={() => {
            saveThemePreference('dark');
            document?.querySelector('html')?.classList.add('dark');
          }}
          className="dark:border-white p-1 border-[1px] border-black rounded-full"
        >
          <MoonIcon className="aspect-square dark:text-white w-4 text-black" />
        </button>
      </div>

      <div
        className="md:space-y-8 relative flex flex-col items-center justify-center space-y-6"
        style={{
          height: 'calc(100vh - 2rem)',
        }}
      >
        <h1 className="text-5xl font-bold">Drawly</h1>
        {startingDrawingSession && (
          <div className="flex justify-center">Starting drawing session...</div>
        )}
        {!startingDrawingSession && (
          <>
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
                value={selectedCategoryOption}
                onChange={(option) => setSelectedCategoryOption(option)}
                placeholder={'Type for suggestions...'}
                isClearable={true}
                noOptionsMessage={() =>
                  'We could not find any related categories for your search'
                }
              />
            </div>
            <div className="flex flex-col items-center space-y-4">
              <h3>Drawing by</h3>
              <div className="flex space-x-4">
                <button
                  className={playfulButton({
                    intent: drawingMode === 'reference' ? 'active' : 'primary',
                  })}
                  onClick={() => setDrawingMode('reference')}
                >
                  Reference
                </button>
                <button
                  className={playfulButton({
                    intent: drawingMode === 'memory' ? 'active' : 'primary',
                  })}
                  onClick={() => setDrawingMode('memory')}
                >
                  Memory
                </button>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <h3>How many images you want to draw?</h3>
              <div className="flex space-x-4">
                {numberOfImagesOptions.map((value) => (
                  <button
                    key={value}
                    onClick={() => setNumberOfImages(value)}
                    className={playfulButton({
                      intent: numberOfImages === value ? 'active' : 'primary',
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
            <div className="flex space-x-4">
              <button className={playfulButton()} onClick={randomSettings}>
                Random settings
              </button>
              <button
                className={playfulButton({
                  intent: startEnabled ? 'primary' : 'disabled',
                })}
                disabled={!startEnabled || startingDrawingSession}
                onClick={async () => {
                  setStartingDrawingSession(true);
                  await router.push(
                    `draw/${selectedCategory}?numberOfImages=${numberOfImages}&duration=${duration}&drawingMode=${drawingMode}`
                  );
                }}
              >
                Start
              </button>
            </div>
          </>
        )}
        <a className="underline opacity-50" href="https://www.pexels.com">
          Photos provided by Pexels
        </a>
        <div className="opacity-25">ver. {version}</div>
      </div>
    </div>
  );
}
