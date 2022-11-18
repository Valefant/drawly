import { pexelsApi } from './init';
import { PhotosWithTotalResults } from 'pexels';

export async function getPhotos(numberOfImages: number, category: string) {
  const response = (await pexelsApi.photos.search({
    per_page: numberOfImages,
    query: category as string,
  })) as PhotosWithTotalResults;

  if (response.photos.length === 0) {
    throw Error(`No images exist for the category: ${category}`);
  }

  return response.photos;
}
