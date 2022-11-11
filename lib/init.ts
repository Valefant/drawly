import { createClient as pexelsCreateClient } from 'pexels';
import { Redis } from '@upstash/redis';

export const pexelsApi = pexelsCreateClient(process.env.PEXELS_API_KEY);

export const redis = Redis.fromEnv();
