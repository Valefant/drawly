'use client';

import { useBoolean, useEventListener, useStep } from 'usehooks-ts';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { Photo } from 'pexels';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import useWebAnimations from '@wellyshen/use-web-animations';

export function Frame({ photos }: { photos: Photo[] }) {
  const [currentStep, { goToNextStep }] = useStep(10);
  const { value: isPlaying, toggle: toggleTimer } = useBoolean(true);
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

    if (key === 'Space') {
      toggleTimer();
    }

    if (key === 'Enter') {
      nextImage();

      if (!isPlaying) {
        toggleTimer();
      }
    }
  });

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-8">
      <picture className="relative">
        <div className="absolute inset-0 z-10 bg-white opacity-0" ref={ref} />
        <img alt={photo.alt as string} src={photo.src.large} />
      </picture>
      <div className="flex opacity-50">
        <a className="underline" href={photo.src.original}>
          Photo
        </a>
        <span>&nbsp;by&nbsp;</span>
        <a className="underline" href={photo.photographer_url}>
          {photo.photographer}
        </a>
        <span>&nbsp;on Pexels</span>
      </div>
      <div className="flex items-center space-x-8">
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
        <div className="space-y-2">
          <button
            onClick={() => goToNextStep()}
            className="hover:bg-slate-200 flex items-center px-4 py-2"
          >
            <span className="text-2xl">Next</span>
            <ChevronRightIcon className="w-8 h-8" />
          </button>

          <div className="ml-4 text-lg">
            <span className="font-bold">{currentStep}</span> / 10
          </div>
        </div>
      </div>
    </div>
  );
}
