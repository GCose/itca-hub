import { CustomError, ErrorResponseData } from '@/types';
import { getErrorMessage } from '@/utils/error';
import { BASE_URL } from '@/utils/url';
import axios, { AxiosError } from 'axios';
import { serialize } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { schoolEmail, password } = req.body;

    try {
      const { data } = await axios.post(`${BASE_URL}/auth/login`, {
        schoolEmail,
        password,
      });

      const cookieData = {
        token: data.data.accessToken,
        role: data.data.user.role,
      };

      const tokenCookie = serialize('itca_hub', JSON.stringify(cookieData), {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 24 * 30, // 30 days in seconds
        sameSite: 'strict',
        path: '/',
      });

      res.setHeader('Set-Cookie', [tokenCookie]);

      res.json({ token: data.data.accessToken, role: data.data.user.role });
    } catch (error: unknown) {
      const { message, statusCode } = getErrorMessage(
        error as AxiosError<ErrorResponseData> | CustomError | Error
      );

      res.status(statusCode).json({ message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
