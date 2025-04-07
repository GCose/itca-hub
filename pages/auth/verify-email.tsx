import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '@/utils/url';
import { NextApiRequest } from 'next';
import { isLoggedIn } from '@/utils/auth';
import { UserAuth } from '@/types';

const VerifyEmail = () => {
  const router = useRouter();
  const { token } = router.query;
  const [status, setStatus] = useState('Verifying your email...');

  useEffect(() => {
    if (token) {
      verifyEmail();
    }
  }, [token]);

  const verifyEmail = async () => {
    try {
      await axios.post(`${BASE_URL}/auth/verify-email`, { verificationToken: token });
      setStatus('Email verified successfully! Redirecting to login...');
      setTimeout(() => router.push('/auth'), 3000);
    } catch (error) {
      setStatus('Verification failed. The link may be expired or invalid.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Email Verification</h1>
        <p className="text-center">{status}</p>
      </div>
    </div>
  );
};

export default VerifyEmail;

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  const userData = isLoggedIn(req);

  // If there is user data and the user data type is not boolean, which means it is of type UserAuth object, then
  if (userData && typeof userData !== 'boolean') {
    const { role } = userData as UserAuth;

    switch (role) {
      case 'admin':
        return {
          redirect: {
            destination: '/admin',
            permanent: false,
          },
        };
      case 'user':
        return {
          redirect: {
            destination: '/student',
            permanent: false,
          },
        };
      default:
        break;
    }
  }

  return {
    props: {
      userData,
    },
  };
};
