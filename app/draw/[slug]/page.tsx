import { Photo, PhotosWithTotalResults } from 'pexels';
import { pexelsApi } from '../../../server';
import { Frame } from './frame';

async function getData(imageCount: number, category: string): Promise<Photo[]> {
  const response = (await pexelsApi.photos.search({
    query: category as string,
    per_page: imageCount,
  })) as PhotosWithTotalResults;

  console.log(response.photos);

  if (response.photos.length === 0) {
    throw Error('Images are empty');
  }

  return response.photos;
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
