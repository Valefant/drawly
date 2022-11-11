import { Photo } from 'pexels';
import { getPhotos } from '../../../lib/serverApi';
import { Frame } from './frame';
import { redis } from '../../../lib/init';
import { DrawingMode, ImageInfo } from '../../../lib/domainTypes';

async function getData(
  numberOfImages: number,
  category: string
): Promise<Photo[]> {
  return getPhotos(numberOfImages, category);
}

export default async function DrawingSession({
  params,
  searchParams,
}: {
  params: { category: string };
  searchParams: {
    numberOfImages: number;
    duration: number;
    drawingMode: DrawingMode;
  };
}) {
  let images: ImageInfo[];

  try {
    if (await dataAvailable(params.category)) {
      images = await getDataFromCache(params.category);
    } else {
      images = pexelsMapper(
        await getData(searchParams.numberOfImages, params.category)
      );
      await cacheCategory(params.category, images);
    }
  } catch (e) {
    // if we hit rate limits with redis, we fall back to reading from the pexels api
    images = pexelsMapper(
      await getData(searchParams.numberOfImages, params.category)
    );
  }

  return (
    <Frame
      duration={searchParams.duration}
      images={images}
      drawingMode={searchParams.drawingMode}
    />
  );
}

function pexelsMapper(photos: Photo[]): ImageInfo[] {
  return photos.map(
    (photo) =>
      ({
        src: {
          large: photo.src.large,
          original: photo.src.original,
        },
        alt: photo.alt,
        author: {
          name: photo.photographer,
          profileUrl: photo.photographer_url,
        },
      } as ImageInfo)
  );
}

function dataAvailable(category: string): Promise<boolean | null> {
  return redis.get(category);
}

async function cacheCategory(
  category: string,
  images: ImageInfo[]
): Promise<void> {
  await redis.setex(category, 86400, JSON.stringify(images));
}

async function getDataFromCache(category: string): Promise<ImageInfo[]> {
  const data = await redis.get<ImageInfo[]>(category);
  return data ?? [];
}
