'use client';

import { useBoolean, useEventListener, useStep } from 'usehooks-ts';
import {
  ChevronRightIcon,
  PlayIcon,
  PauseIcon,
} from '@heroicons/react/24/solid';
import { Photo } from 'pexels';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import useWebAnimations from '@wellyshen/use-web-animations';
import Attribution from '../../../components/attribution';
import { useEffect, useRef, useState } from 'react';
import { playfulButton } from '../../../components/design';
import { grayscale, printCanvas, roberts, thresholding } from 'lena-ts';

function useRotation() {
  const [rotation, setRotation] = useState(0);
  const rotate = () => {
    setRotation((prev) => prev + 90);
  };
  return { rotation, rotate };
}

const filters = ['gray', 'edge', 'shadows'] as const;
type Filter = typeof filters[number];
const filterMapping: { [key in Filter]: (pixels: ImageData) => ImageData } = {
  gray: grayscale,
  edge: roberts,
  shadows: thresholding,
};

interface FilterSelectionProps {
  activeFilter: Filter | null;
  onFilterChange: (filter: Filter | null) => void;
}

function FilterSelection({
  activeFilter,
  onFilterChange,
}: FilterSelectionProps) {
  return (
    <div className="flex space-x-4">
      {filters.map((filter, i) => (
        <button
          title={`${filter} (${i + 1})`}
          className={playfulButton({
            intent: activeFilter === filter ? 'active' : 'primary',
          })}
          key={filter}
          onClick={() => onFilterChange(filter)}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}

export function Frame({
  duration,
  photos,
}: {
  duration: number;
  photos: Photo[];
}) {
  const documentRef = useRef<Document | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentStep, { goToNextStep }] = useStep(photos.length);
  const [activeFilter, setActiveFilter] = useState<Filter | null>(null);
  const {
    value: isPlaying,
    toggle: toggleTimer,
    setTrue: continueTimer,
    setFalse: pauseTimer,
  } = useBoolean(true);
  const timerPausedByInactiveTab = useRef(false);
  const { value: flipped, toggle: toggleFlip } = useBoolean(false);
  const { rotation, rotate } = useRotation();
  // step starts by 1
  const index = currentStep - 1;
  const photo = photos[index];

  const { ref, getAnimation } = useWebAnimations<HTMLDivElement>({
    keyframes: { opacity: [1, 0] },
    animationOptions: {
      duration: 1000,
    },
  });

  useEffect(() => {
    documentRef.current = window.document;
  }, []);

  const nextImage = () => {
    goToNextStep();
    // todo: active filter should be applied to the next image as well
    setActiveFilter(null);
    getAnimation()?.play();
  };

  const changeFilterHandler = (filter: Filter | null) => {
    if (imgRef.current === null || canvasRef.current === null) {
      return;
    }

    if (filter === null) {
      setActiveFilter(null);
      return;
    }

    const imageData = getImageData(imgRef.current);
    const filterAppliedImageData = filterMapping[filter](imageData);
    printCanvas(canvasRef.current, filterAppliedImageData);

    if (filter === activeFilter) {
      setActiveFilter(null);
    } else {
      setActiveFilter(filter);
    }
  };

  useEventListener(
    'visibilitychange',
    () => {
      if (document.hidden) {
        if (isPlaying) {
          pauseTimer();
          timerPausedByInactiveTab.current = true;
        } else {
          timerPausedByInactiveTab.current = false;
        }
      } else {
        if (timerPausedByInactiveTab.current) {
          continueTimer();
        }
      }
    },
    documentRef
  );

  useEventListener('keydown', (e) => {
    const key = e.code;

    if (key === 'KeyP') {
      toggleTimer();
    }

    if (key === 'Enter' || key === 'NumpadEnter') {
      nextImage();

      // when paused, start the timer again when showing the next image
      if (!isPlaying) {
        toggleTimer();
      }
    }

    if (e.key === 'f') {
      toggleFlip();
    }

    if (e.key === 'r') {
      rotate();
    }

    if (e.key === '1' || e.key === '2' || e.key === '3') {
      changeFilterHandler(filters[Number(e.key) - 1]);
    }
  });

  return (
    <div className="dark:bg-neutral-800 dark:text-white md:space-y-8 flex flex-col items-center justify-center h-screen space-y-4">
      <picture
        className="dark:border-white relative z-10 border-2 border-black"
        style={{
          transition: 'transform 0.3s',
          transform: `rotate(${rotation}deg) scaleX(${flipped ? -1 : 1})`,
        }}
      >
        <div className="absolute inset-0 z-20 bg-white opacity-0" ref={ref} />
        <img
          crossOrigin="anonymous"
          ref={imgRef}
          alt={photo.alt as string}
          src={photo.src.large}
          className={activeFilter ? 'hidden' : ''}
        />
        <canvas
          style={{ width: '100%', height: '100%' }}
          ref={canvasRef}
          className={activeFilter ? '' : 'hidden'}
        ></canvas>
      </picture>
      <Attribution
        className="flex opacity-50"
        imageUrl={photo.src.original}
        author={{
          name: photo.photographer,
          profileUrl: photo.photographer_url,
        }}
        platform="Pexels"
      />
      <div className="md:scale-100 sm:scale-75 md:space-x-8 flex items-center space-x-6 scale-50">
        <div className="flex flex-col">
          <button
            className={playfulButton()}
            onClick={() => toggleTimer()}
            title={`${isPlaying ? 'Pause' : 'Play'} (p)`}
          >
            {isPlaying ? <PauseIcon width="24" /> : <PlayIcon width="24" />}
          </button>
        </div>
        <audio ref={audioRef} src="/sound.wav"></audio>
        <div className="dark:invert">
          <CountdownCircleTimer
            duration={duration * 60}
            isPlaying={isPlaying}
            key={currentStep}
            colors={'#000000'}
            onComplete={() => {
              audioRef.current?.play();
              nextImage();
            }}
          >
            {({ remainingTime }) => (
              <button
                className="dark:text-black text-4xl"
                onClick={toggleTimer}
              >
                {remainingTime}
              </button>
            )}
          </CountdownCircleTimer>
        </div>
        <div className="flex flex-col space-y-2">
          <FilterSelection
            activeFilter={activeFilter}
            onFilterChange={changeFilterHandler}
          />
          <div className="flex justify-center space-x-2">
            <button
              className={playfulButton()}
              onClick={() => rotate()}
              title="Rotate (r)"
            >
              rotate
            </button>
            <button
              className={playfulButton({
                intent: flipped ? 'active' : 'primary',
              })}
              onClick={() => toggleFlip()}
              title="Flip (f)"
            >
              flip
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <button
            className={`flex ${playfulButton()}`}
            onClick={() => {
              nextImage();
            }}
            title="Next (enter)"
          >
            <span className="text-2xl">Next</span>
            <ChevronRightIcon className="w-6" />
          </button>

          <div className="ml-4 text-lg">
            <span className="font-bold">{currentStep}</span> / {photos.length}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * This is a replacement function for the one provided by lena-ts.
 * When the image element is resized (e.g. when using a smaller viewport on mobile) the image is scaled automatically.
 * Taking the element width and height of the original getImageData function will lose pixels
 * as the image could be scaled down.
 *
 * @param img The img element to get the intrinsic size from
 */
function getImageData(img: HTMLImageElement): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, img.naturalWidth, img.naturalHeight);
}
