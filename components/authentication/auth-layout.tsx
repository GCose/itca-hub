import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  rightSideContent?: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  description,
  rightSideContent,
}) => {
  return (
    <>
      <Head>
        <title>ITCA Hub | {title}</title>
        <link rel="icon" href="/images/logo.jpg" />
        <meta name="description" content={description} />
      </Head>

      <div className="min-h-screen flex flex-col md:flex-row">
        {/*==================== Left Side - Form ====================*/}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-16 relative">
          {/*==================== Enhanced Background Elements ====================*/}

          {/*==================== Base gradient ====================*/}
          <div className="absolute inset-0 -z-20 bg-gradient-to-b from-white to-gray-100"></div>

          {/*==================== Animated grid lines ====================*/}
          <div className="absolute inset-0 -z-19 overflow-hidden">
            {/*==================== Horizontal lines ====================*/}
            <div className="absolute top-1/4 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-blue-700/20 to-transparent animate-pulse"></div>
            <div
              className="absolute top-2/4 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-amber-500/20 to-transparent animate-pulse"
              style={{ animationDelay: '1s' }}
            ></div>
            <div
              className="absolute top-3/4 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-blue-700/20 to-transparent animate-pulse"
              style={{ animationDelay: '2s' }}
            ></div>

            {/*==================== Vertical lines ====================*/}
            <div className="absolute top-0 left-1/4 h-full w-[1px] bg-gradient-to-b from-transparent via-blue-700/20 to-transparent animate-pulse"></div>
            <div
              className="absolute top-0 left-2/4 h-full w-[1px] bg-gradient-to-b from-transparent via-amber-500/20 to-transparent animate-pulse"
              style={{ animationDelay: '1.5s' }}
            ></div>
            <div
              className="absolute top-0 left-3/4 h-full w-[1px] bg-gradient-to-b from-transparent via-blue-700/20 to-transparent animate-pulse"
              style={{ animationDelay: '2.5s' }}
            ></div>
          </div>

          {/*==================== Glowing Dots at Intersections ====================*/}
          <div className="absolute inset-0 -z-18 opacity-50">
            {/*==================== First Row ====================*/}
            <div className="absolute top-1/4 left-1/4 h-2 w-2 rounded-full bg-blue-500/40 animate-pulse shadow-sm shadow-blue-500/30"></div>
            <div
              className="absolute top-1/4 left-2/4 h-2 w-2 rounded-full bg-amber-500/40 animate-pulse shadow-sm shadow-amber-500/30"
              style={{ animationDelay: '0.5s' }}
            ></div>
            <div
              className="absolute top-1/4 left-3/4 h-2 w-2 rounded-full bg-blue-500/40 animate-pulse shadow-sm shadow-blue-500/30"
              style={{ animationDelay: '1s' }}
            ></div>
            {/*==================== End of First Row ====================*/}

            {/*==================== Second Row ====================*/}
            <div
              className="absolute top-2/4 left-1/4 h-2 w-2 rounded-full bg-amber-500/40 animate-pulse shadow-sm shadow-amber-500/30"
              style={{ animationDelay: '1.5s' }}
            ></div>
            <div
              className="absolute top-2/4 left-2/4 h-2 w-2 rounded-full bg-blue-500/40 animate-pulse shadow-sm shadow-blue-500/30"
              style={{ animationDelay: '2s' }}
            ></div>
            <div
              className="absolute top-2/4 left-3/4 h-2 w-2 rounded-full bg-amber-500/40 animate-pulse shadow-sm shadow-amber-500/30"
              style={{ animationDelay: '2.5s' }}
            ></div>
            {/*==================== End of Second Row ====================*/}

            {/*==================== Third Row ====================*/}
            <div
              className="absolute top-3/4 left-1/4 h-2 w-2 rounded-full bg-blue-500/40 animate-pulse shadow-sm shadow-blue-500/30"
              style={{ animationDelay: '3s' }}
            ></div>
            <div
              className="absolute top-3/4 left-2/4 h-2 w-2 rounded-full bg-amber-500/40 animate-pulse shadow-sm shadow-amber-500/30"
              style={{ animationDelay: '3.5s' }}
            ></div>
            <div
              className="absolute top-3/4 left-3/4 h-2 w-2 rounded-full bg-blue-500/40 animate-pulse shadow-sm shadow-blue-500/30"
              style={{ animationDelay: '4s' }}
            ></div>
          </div>
          {/*==================== End of Third Row ====================*/}

          {/*==================== Geometric Elements ====================*/}
          <div className="absolute inset-0 -z-17 overflow-hidden">
            {/*==================== Top right Circle ====================*/}
            <div className="absolute -top-10 right-20 h-80 w-80 rounded-full bg-blue-700/6 animate-pulse"></div>

            {/*==================== Top left Circle ====================*/}
            <div
              className="absolute top-20 -left-40 h-96 w-96 rounded-full border-[30px] border-amber-500/6 animate-pulse"
              style={{ animationDelay: '2s' }}
            ></div>
            {/*==================== End of Top left Circle ====================*/}

            {/*==================== Bottom Circle ====================*/}
            <div
              className="absolute -bottom-20 left-40 h-80 w-80 rounded-full bg-amber-500/6 animate-pulse"
              style={{ animationDelay: '1s' }}
            ></div>
            {/*==================== End of Bottom Circle ====================*/}

            {/*==================== Decorative Element - Center Right ====================*/}
            <div
              className="absolute top-1/2 -right-20 h-60 w-60 rounded-full border-[20px] border-blue-700/6 animate-pulse"
              style={{ animationDelay: '3s' }}
            ></div>
            {/*==================== End of Decorative Element - Center Right ====================*/}
          </div>
          {/*==================== End of Geometric Elements ====================*/}

          {/*==================== Subtle Dot Pattern ====================*/}
          <div
            className="absolute inset-0 -z-16 opacity-10"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, rgba(30,64,175,0.15) 1px, transparent 0)',
              backgroundSize: '30px 30px',
            }}
          ></div>
          {/*==================== End of Subtle Dot Pattern ====================*/}

          {/*==================== Blurred Gradient orbs ====================*/}
          <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-tr from-blue-700/5 to-transparent rounded-full blur-3xl -z-15"></div>
          <div className="absolute bottom-40 right-10 w-48 h-48 bg-gradient-to-bl from-amber-500/5 to-transparent rounded-full blur-3xl -z-15"></div>

          {/*==================== End of Background Elements ====================*/}

          <div className="w-full max-w-md relative z-10">
            <div className="mb-8">
              <Link
                href="/"
                className="inline-flex items-center text-gray-600 hover:text-blue-700 transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to home
              </Link>
            </div>

            <div className="mb-8 flex justify-center md:justify-start">
              <Link href="/">
                <Image
                  width={150}
                  height={50}
                  alt="ITCA Logo"
                  src="/images/logo.jpg"
                  className="h-12 w-auto"
                />
              </Link>
            </div>

            <motion.div
              className="backdrop-blur-xl"
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              initial={{ opacity: 0, x: -70 }}
            >
              {children}
            </motion.div>
          </div>
        </div>
        {/*==================== End of Left Side - Form ====================*/}

        {/*==================== Right Side - Image/Design ====================*/}
        <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-blue-700 to-gray-900 relative overflow-hidden">
          {/*==================== Background Image ====================*/}
          <div className="absolute inset-0 z-0">
            <Image
              fill
              priority
              alt="Background"
              className="opacity-20"
              style={{ objectFit: 'cover' }}
              src="/images/main-building.jpeg"
            />
          </div>
          {/*==================== End of Background Image ====================*/}

          {/*==================== Grid Pattern ====================*/}
          <div
            className="absolute inset-0 opacity-10 z-10"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(255, 255, 255, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 1px, transparent 1px)',
              backgroundSize: '80px 80px',
            }}
          ></div>
          {/*==================== End of Grid Pattern ====================*/}

          {/*==================== Animated lines ====================*/}
          <div className="absolute inset-0 overflow-hidden z-20">
            <div className="absolute top-1/4 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-amber-500/70 to-transparent animate-pulse"></div>
            <div
              className="absolute top-2/4 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-white/70 to-transparent animate-pulse"
              style={{ animationDelay: '1s' }}
            ></div>
            <div
              className="absolute top-3/4 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-amber-500/70 to-transparent animate-pulse"
              style={{ animationDelay: '2s' }}
            ></div>

            <div className="absolute top-0 left-1/4 h-full w-[2px] bg-gradient-to-b from-transparent via-white/70 to-transparent animate-pulse"></div>
            <div
              className="absolute top-0 left-2/4 h-full w-[2px] bg-gradient-to-b from-transparent via-amber-500/70 to-transparent animate-pulse"
              style={{ animationDelay: '1.5s' }}
            ></div>
            <div
              className="absolute top-0 left-3/4 h-full w-[2px] bg-gradient-to-b from-transparent via-white/70 to-transparent animate-pulse"
              style={{ animationDelay: '2.5s' }}
            ></div>
          </div>
          {/*==================== End of Animated lines ====================*/}

          {/*==================== Content Slot For the Right Side ====================*/}
          <div className="absolute inset-0 flex flex-col justify-center items-center p-16 text-white z-30">
            {rightSideContent}
          </div>
          {/*==================== End of Content Slot For the Right Side ====================*/}

          {/*==================== Decorative elements ====================*/}
          <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-amber-500/20 blur-3xl z-10"></div>
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-blue-400/20 blur-3xl z-10"></div>
          {/*==================== End of Decorative elements ====================*/}
        </div>
        {/*==================== End of Right Side - Image/Design ====================*/}
      </div>
    </>
  );
};

export default AuthLayout;
