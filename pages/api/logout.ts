import { CustomError, ErrorResponseData } from '@/types';
import { getErrorMessage } from '@/utils/error';
import { AxiosError } from 'axios';
import { serialize } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const tokenCookie = serialize('itca_hub', JSON.stringify({}), {
      httpOnly: true,
      secure: true,
      path: '/',
      maxAge: -1,
    });

    res.setHeader('Set-Cookie', [tokenCookie]);

    res.redirect('/auth');
  } catch (error) {
    const { message, statusCode } = getErrorMessage(
      error as AxiosError<ErrorResponseData> | CustomError | Error
    );
    res.status(statusCode).json({ message });
  }
}
