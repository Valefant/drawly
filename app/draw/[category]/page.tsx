import { Photo } from 'pexels';
import { getPhotos } from '../../../lib/serverApi';
import { Frame } from './frame';
import { redis, supabase } from '../../../lib/init';
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
    numberOfImages: string;
    duration: string;
    drawingMode: DrawingMode;
    image: string;
  };
}) {
  const category = params.category;
  const savedCategoryPromise = saveCategoryToDatabase(category);
  const numberOfImages = Number(searchParams.numberOfImages);
  const duration = Number(searchParams.duration);
  const drawingMode = searchParams.drawingMode;

  let images: ImageInfo[];

  try {
    if (await dataAvailable(category)) {
      images = await getDataFromCache(category);
    } else {
      images = pexelsMapper(await getData(numberOfImages, category));
      await cacheCategory(category, images);
    }
  } catch (e) {
    // if we hit rate limits with redis, we fall back to reading from the pexels api
    images = pexelsMapper(await getData(numberOfImages, category));
  }

  await savedCategoryPromise;

  return (
    <Frame duration={duration} images={images} drawingMode={drawingMode} />
  );
}

async function saveCategoryToDatabase(category: string): Promise<void> {
  await supabase.from('selected_categories').insert([{ category }]);
  return Promise.resolve();
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
      }) as ImageInfo
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
