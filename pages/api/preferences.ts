import { NextApiRequest, NextApiResponse } from 'next';
import { serialize, CookieSerializeOptions } from 'cookie';

export const setCookie = (
  res: NextApiResponse,
  name: string,
  value: unknown,
  options: CookieSerializeOptions = {}
) => {
  const stringValue =
    typeof value === 'object' ? 'j:' + JSON.stringify(value) : String(value);

  if (typeof options.maxAge === 'number') {
    options.expires = new Date(Date.now() + options.maxAge * 1000);
  }

  res.setHeader('Set-Cookie', serialize(name, stringValue, options));
};

// https://nextjs.org/docs/api-routes/request-helpers#extending-the-reqres-objects-with-typescript
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { theme } = req.query;
  setCookie(res, 'theme', theme, { path: '/' });

  res.status(200).json({});
}
