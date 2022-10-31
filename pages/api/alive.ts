// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import pkg from '../../package.json';

type Alive = {
  status: string;
  version: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Alive>
) {
  res.status(200).json({
    status: 'Alive',
    version: pkg.version,
  });
}
