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
import { useRef, useState } from 'react';
import { playfulButton } from '../../../components/design';

function useRotation() {
  const [rotation, setRotation] = useState(0);
  const rotate = () => {
    setRotation((prev) => prev + 90);
  };
  return { rotation, rotate };
}

export function Frame({
  duration,
  photos,
}: {
  duration: number;
  photos: Photo[];
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentStep, { goToNextStep }] = useStep(photos.length);
  const { value: isPlaying, toggle: toggleTimer } = useBoolean(true);
  const { value: flipped, toggle: toggleFlip } = useBoolean(false);
  const { rotation, rotate } = useRotation();
  // step starts by 1
  const index = currentStep - 1;
  const photo = photos[index];
  const buttonClasses = playfulButton();

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
    <div className="md:space-y-8 flex flex-col items-center justify-center h-screen space-y-4">
      <picture
        className="relative z-10"
        style={{
          transition: 'transform 0.3s',
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
      <div className="md:scale-100 sm:scale-75 md:space-x-8 flex items-center space-x-6 scale-50">
        <div className="flex flex-col">
          <button
            className={buttonClasses}
            onClick={() => toggleTimer()}
            title={`${isPlaying ? 'Pause' : 'Play'} (p)`}
          >
            {isPlaying ? <PauseIcon width="24" /> : <PlayIcon width="24" />}
          </button>
        </div>
        <audio ref={audioRef} src="/sound.wav"></audio>
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
            <button className="text-4xl" onClick={toggleTimer}>
              {remainingTime}
            </button>
          )}
        </CountdownCircleTimer>
        <div className="flex flex-col space-y-2">
          <div className="flex justify-center space-x-2">
            <button
              className={buttonClasses}
              onClick={() => rotate()}
              title="Rotate (r)"
            >
              rotate
            </button>
            <button
              className={buttonClasses}
              onClick={() => toggleFlip()}
              title="Flip (f)"
            >
              {flipped && <div className="w-2 h-2 bg-blue-600 rounded-full" />}{' '}
              flip
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <button
            className={`flex ${buttonClasses}`}
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
