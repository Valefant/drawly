import Image from 'next/image';
import Attribution from '../components/attribution';
import Link from 'next/link';
import { playfulButton } from '../components/design';

const imageWidth = 400;
const imageHeight = 600;

export default function NotFound() {
  return (
    <div className="dark:bg-neutral-800 dark:text-white flex flex-col items-center justify-center h-screen space-y-8">
      <h1 className="text-3xl">What are you looking at?</h1>
      <h2 className="text-2xl">There is nothing to see here</h2>
      <figure className="space-y-4">
        <Image
          src={`https://images.pexels.com/photos/4587959/pexels-photo-4587959.jpeg?auto=compress&cs=tinysrgb&h=${imageHeight}&w=${imageWidth}`}
          alt="Sad cat"
          width={imageWidth}
          height={imageHeight}
        />
        <Attribution
          className="flex justify-center text-sm opacity-50"
          imageUrl="https://images.pexels.com/photos/4587959/pexels-photo-4587959.jpeg"
          author={{
            name: 'Tranmautritam',
            profileUrl: 'https://www.pexels.com/@shvetsa/',
          }}
          platform="Pexels"
        />
      </figure>
      <Link className={playfulButton()} href="/">
        Home
      </Link>
    </div>
  );
}
