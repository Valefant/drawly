import { Photo } from 'pexels';
import { getPhotos } from '../../../lib/serverApi';
import { Frame } from './frame';

async function getData(imageCount: number, category: string): Promise<Photo[]> {
  return getPhotos(imageCount, category);
}

export default async function DrawingSession({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { imageCount: number; duration: number };
}) {
  const photos = await getData(searchParams.imageCount, params.slug);

  return <Frame duration={searchParams.duration} photos={photos} />;
}
