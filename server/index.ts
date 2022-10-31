import { createClient as pexelsCreateClient } from 'pexels';

export const pexelsApi = pexelsCreateClient(process.env.PEXELS_API_KEY);
