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
import { playfulButtonDesign } from '../../../components/design';
import Attribution from '../../../components/attribution';
import { useState } from 'react';

function useRotation() {
  const [rotation, setRotation] = useState(0);
  const rotate = () => {
    setRotation((prev) => prev + 90);
  };
  return { rotation, rotate };
}

export function Frame({ photos }: { photos: Photo[] }) {
  const [currentStep, { goToNextStep }] = useStep(10);
  const { value: isPlaying, toggle: toggleTimer } = useBoolean(true);
  const { value: flipped, toggle: toggleFlip } = useBoolean(false);
  const { rotation, rotate } = useRotation();
  const photo = photos[currentStep];

  const { ref, getAnimation } = useWebAnimations<HTMLDivElement>({
    keyframes: { opacity: [1, 0] },
    animationOptions: {
      duration: 1000,
    },
  });

  const nextImage = () => {
    goToNextStep();
    getAnimation()?.play();
  };

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
  });

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-8">
      <picture
        className="relative z-10"
        style={{
          transition: 'transform 0.35s',
          transform: `rotate(${rotation}deg) scaleX(${flipped ? -1 : 1})`,
        }}
      >
        <div className="absolute inset-0 z-20 bg-white opacity-0" ref={ref} />
        <img alt={photo.alt as string} src={photo.src.large} />
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
      <div className="flex items-center space-x-8">
        <div className="flex flex-col">
          <button {...playfulButtonDesign} onClick={() => toggleTimer()}>
            {isPlaying ? <PauseIcon width="24" /> : <PlayIcon width="24" />}
          </button>
        </div>
        <CountdownCircleTimer
          duration={60}
          isPlaying={isPlaying}
          key={currentStep}
          colors={'#000000'}
          onComplete={() => nextImage()}
        >
          {({ remainingTime }) => (
            <button className="text-4xl" onClick={toggleTimer}>
              {remainingTime}
            </button>
          )}
        </CountdownCircleTimer>
        <div className="flex flex-col space-y-2">
          <div className="flex justify-center space-x-2">
            <button {...playfulButtonDesign} onClick={() => rotate()}>
              (r) rotate
            </button>
            <button {...playfulButtonDesign} onClick={() => toggleFlip()}>
              (f) flip
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <button {...playfulButtonDesign} onClick={() => nextImage()}>
            <span className="text-2xl">Next</span>
            <ChevronRightIcon className="w-6" />
          </button>

          <div className="ml-4 text-lg">
            <span className="font-bold">{currentStep}</span> / 10
          </div>
        </div>
      </div>
    </div>
  );
}
