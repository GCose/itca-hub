import { UserAuth } from '@/types';
import { parse } from 'cookie';
import { NextApiRequest } from 'next';

export const isLoggedIn = (req: NextApiRequest): boolean | UserAuth => {
  if (!req || !req.headers || !req.headers.cookie) {
    return false;
  }

  const cookies = parse(req.headers.cookie || '');

  if (cookies && cookies.itca_hub) return JSON.parse(cookies.itca_hub) as UserAuth;

  return false;
};
