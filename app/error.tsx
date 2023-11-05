'use client';

import Link from 'next/link';
import Image from 'next/image';
import { playfulButton } from './components/design';
import Attribution from './components/attribution';

const imageWidth = 690;
const imageHeight = 480;
export default function Error({ error }: { error: Error }) {
  return (
    <div className="dark:bg-neutral-800 dark:text-white flex flex-col items-center justify-center h-screen space-y-8">
      <h1 className="text-3xl">Sorry, something went wrong :(</h1>
      <p className="text-xl">{error.message}</p>
      <figure className="space-y-4">
        <Image
          src={`https://images.pexels.com/photos/2194261/pexels-photo-2194261.jpeg?auto=compress&cs=tinysrgb&h=${imageHeight}&w=${imageWidth}`}
          alt="Sad cat"
          width={imageWidth}
          height={imageHeight}
        />
        <Attribution
          className="flex justify-center text-sm opacity-50"
          imageUrl="https://images.pexels.com/photos/2194261/pexels-photo-2194261.jpeg"
          author={{
            name: 'Tranmautritam',
            profileUrl: 'https://www.pexels.com/@tranmautritam/',
          }}
          platform="Pexels"
        />
      </figure>
      <p className="text-xl">
        You probably are as shocked as this cat right now, but do not fear my
        friend
      </p>
      <Link className={playfulButton()} href="/">
        Let{"'"}s get back home
      </Link>
    </div>
  );
}
