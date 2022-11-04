'use client';

import Image from 'next/image';
import bgImage from '../public/tile_background.png';
import { useDebounce } from 'usehooks-ts';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Select from 'react-select';
import { playfulButton } from '../components/design';

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

const imageCountOptions = [5, 10, 15];
const timerDurationOptions = [1, 3, 5];

export default function Home() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 250);
  const { suggestions, isLoading } = useSuggestions(debouncedSearchTerm);
  const suggestionOptions = suggestions.map((e) => ({ label: e, value: e }));
  const [startDrawingSession, setStartDrawingSession] = useState(false);
  const [imageCount, setImageCount] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const startEnabled =
    selectedOption != '' && imageCount != null && duration != null;

  return (
    <div className="relative h-screen">
      <Image
        src={bgImage}
        alt="background"
        className="absolute h-full"
        style={{
          objectFit: 'cover',
        }}
        quality={100}
      />
      <div className="relative flex flex-col items-center justify-center h-full space-y-8">
        <h1 className="text-5xl font-bold">Drawly</h1>
        <div className="w-[22rem]">
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
          disabled={!startEnabled}
          onClick={async () => {
            setStartDrawingSession(true);
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
