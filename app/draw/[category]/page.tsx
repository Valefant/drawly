import { Photo } from 'pexels';
import { getPhotos } from '../../../lib/serverApi';
import { Frame } from './frame';

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
  searchParams: { numberOfImages: number; duration: number };
}) {
  const photos = await getData(searchParams.numberOfImages, params.category);

  return <Frame duration={searchParams.duration} photos={photos} />;
}
