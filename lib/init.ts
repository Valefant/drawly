import { createClient as pexelsCreateClient } from 'pexels';
import { Redis } from '@upstash/redis';
import { createClient as supabaseCreateClient } from '@supabase/supabase-js';
import { Database } from './database.types';

export const pexelsApi = pexelsCreateClient(process.env.PEXELS_API_KEY);

export const redis = Redis.fromEnv();

export const supabase = supabaseCreateClient<Database>(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
