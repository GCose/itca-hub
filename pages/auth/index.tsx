import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import Link from 'next/link';
import AuthLayout from '@/components/authentication/auth-layout';
import AuthButton from '@/components/authentication/auth-button';
import useTimedError from '@/hooks/timed-error';
import axios from 'axios';
import { UserAuth } from '@/types';
import { useRouter } from 'next/router';
import { NextApiRequest } from 'next';
import { isLoggedIn } from '@/utils/auth';
import { toast } from 'sonner';

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [schoolEmail, setSchoolEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useTimedError();

  const router = useRouter();

  // Call this for resend verification link
  // const handleResendVerificationLink = async () => {
  //   try {
  //     await axios.post(`${BASE_URL}/auth/resend-verification`, { schoolEmail });

  //     // Show success message for resent verification link, something like this below

  //     // toast.success('Verification email sent successfully', {
  //     //   id: toast.loading('Sending email...'),
  //     //   description: 'Check your email for the verification link',
  //     //   duration: 5000,
  //     // });
  //   } catch (error) {
  //     const { message } = getErrorMessage(
  //       error as AxiosError<ErrorResponseData> | CustomError | Error
  //     );
  //     setError(message);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!schoolEmail || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await axios.post('/api/login', { schoolEmail, password });

      // Show that alert user is logged in
      toast.success('Login In Successful', { description: 'You have been logged in sucessfully' });

      switch (data.role) {
        case 'admin':
          router.push('/admin');
          break;
        case 'user':
          router.push('/student');
          break;
        default:
          break;
      }
    } catch {
      setError('Unable to sign you in. You need an internet connection to sign-in.');
    } finally {
      setIsLoading(false);
    }
  };

  // Right side content that will be displayed in the AuthLayout
  const rightSideContent = (
    <motion.div
      initial={{ opacity: 0, x: 70 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, delay: 0.5 }}
      className="max-w-4xl text-center"
    >
      <h2 className="text-6xl font-bold mb-6">Unlock Your Potential with ITCA</h2>
      <p className="text-lg text-white/80 mb-8">
        Access exclusive resources, connect with industry professionals, and enhance your skills in
        information technology and communication.
      </p>

      <div className="flex justify-center space-x-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center hover:translate-y-3 hover:transition-all hover: duration-300">
          <div className="text-2xl font-bold text-amber-500">20+</div>
          <div className="text-sm text-white/80">Events</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center hover:translate-y-3 hover:transition-all hover: duration-300">
          <div className="text-2xl font-bold text-amber-500">15+</div>
          <div className="text-sm text-white/80">Members</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center hover:translate-y-3 hover:transition-all hover: duration-300">
          <div className="text-2xl font-bold text-amber-500">2+</div>
          <div className="text-sm text-white/80">Partners</div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <AuthLayout
      title="Sign In"
      rightSideContent={rightSideContent}
      description="Sign in to your ITCA account"
    >
      <>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
        <p className="text-gray-600 mb-8">Sign in to your account to continue</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                required
                id="email"
                type="email"
                value={schoolEmail}
                placeholder="your.email@utg.edu.gm"
                onChange={(e) => setSchoolEmail(e.target.value)}
                className="pl-10 w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-blue-700 hover:text-blue-600 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                required
                id="password"
                value={password}
                placeholder="••••••••"
                type={showPassword ? 'text' : 'password'}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <AuthButton type="submit" isLoading={isLoading} loadingText="Signing in...">
            Sign in
          </AuthButton>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Do not have an account?{' '}
            <Link
              href="/auth/sign-up"
              className="text-blue-700 hover:text-blue-600 font-medium transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </>
    </AuthLayout>
  );
};

export default SignIn;

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
