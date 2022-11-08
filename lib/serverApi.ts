import { pexelsApi } from './init';
import { PhotosWithTotalResults } from 'pexels';

export async function getPhotos(imageCount: number, category: string) {
  const response = (await pexelsApi.photos.search({
    per_page: imageCount,
    query: category as string,
  })) as PhotosWithTotalResults;

  if (response.photos.length === 0) {
    throw Error(`No images exist for the category: ${category}`);
  }

  return response.photos;
}
