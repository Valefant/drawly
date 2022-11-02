import { Photo, PhotosWithTotalResults } from 'pexels';
import { pexelsApi } from '../../../server';
import { Frame } from './frame';

async function getData(key: string): Promise<Photo[]> {
  const response = (await pexelsApi.photos.search({
    query: key as string,
  })) as PhotosWithTotalResults;

  if (response.photos.length === 0) {
    throw Error('Images are empty');
  }

  return response.photos;
}

export default async function Run({ params }: { params: { slug: string } }) {
  const photos = await getData(params.slug);

  return <Frame photos={photos} />;
}
