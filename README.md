# drawly

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FValefant%2Fdrawly&env=PEXELS_API_KEY,UPSTASH_REDIS_REST_URL,UPSTASH_REDIS_REST_TOKEN,SUPABASE_URL,SUPABASE_KEY)

Improve your drawing by practicing your skill daily with the help of drawly!

## NextJS

This is a [Next.js](https://nextjs.org/) project bootstrapped
with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Env file

Copy the provided example environment file

```sh
cp .env.example .env
```

Variables

- `PEXELS_API_KEY` is used for loading images
- `UPSTASH_REDIS_*` is used for caching purposes
- `SUPABASE_*` is used as database

## Image Providers

With extensibility in mind, there should be the possibility to include multiple sources where the images are loaded
from.

### Currently included

#### Pexels

Images provided by [Pexels](https://www.pexels.com)

## Caching

### Upstash Redis

To avoid requesting the pexels api too much we are caching the selected categories for a day.

## Database

### Supabase

Supabase is used as a primary datastore.

## Misc

### Resources

- Background tiles on the starting page were generated with [patternico](https://patternico.com)
- Project Font is [Gloria Hallelujah](https://fonts.google.com/specimen/Gloria+Hallelujah?vfquery=glor&query=gloria)
  designed by [Kimberly Geswein](https://fonts.google.com/?query=Kimberly+Geswein)
- Image changed sound generated with [sfxr](https://sfxr.me/)
