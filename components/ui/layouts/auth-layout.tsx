import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";

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
        <title>ITCA | {title}</title>
        <link rel="icon" href="/images/logo.jpg" />
        <meta name="description" content={description} />
      </Head>

      <div className="min-h-screen flex flex-col md:flex-row">
        {/*==================== Left side - Form ====================*/}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-16">
          {/* Background elements */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white to-gray-100"></div>
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute sm:left-70 lg:left-96 top-0 h-80 w-80 rounded-full bg-blue-700/5"></div>
            <div className="absolute left-5 bottom-0 h-60 w-60 rounded-full bg-amber-500/5"></div>
          </div>

          <div className="w-full max-w-md">
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
                  src="/images/logo.jpg"
                  alt="ITCA Logo"
                  width={150}
                  height={50}
                  className="h-12 w-auto"
                />
              </Link>
            </div>

            <motion.div
              className="backdrop-blur-xl"
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              initial={{ opacity: 0, y: 70 }}
            >
              {children}
            </motion.div>
          </div>
        </div>
        {/*==================== End of Left side - Form ====================*/}

        {/*==================== Right side - Image/Design ====================*/}
        <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-blue-700 to-gray-900 relative overflow-hidden">
          {/*==================== Background Image ====================*/}
          <div className="absolute inset-0 z-0">
            <Image
              fill
              priority
              alt="Background"
              className="opacity-20"
              style={{ objectFit: "cover" }}
              src="/images/main-building.jpeg"
            />
          </div>
          {/*==================== End of Background Image ====================*/}

          {/*==================== Grid pattern ====================*/}
          <div
            className="absolute inset-0 opacity-10 z-10"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255, 255, 255, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          ></div>
          {/*==================== End of Grid pattern ====================*/}

          {/*==================== Animated lines ====================*/}
          <div className="absolute inset-0 overflow-hidden z-20">
            <div className="absolute top-1/4 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-amber-500/40 to-transparent animate-pulse"></div>
            <div
              className="absolute top-2/4 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute top-3/4 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-amber-500/40 to-transparent animate-pulse"
              style={{ animationDelay: "2s" }}
            ></div>

            <div className="absolute top-0 left-1/4 h-full w-[2px] bg-gradient-to-b from-transparent via-white/40 to-transparent animate-pulse"></div>
            <div
              className="absolute top-0 left-2/4 h-full w-[2px] bg-gradient-to-b from-transparent via-amber-500/40 to-transparent animate-pulse"
              style={{ animationDelay: "1.5s" }}
            ></div>
            <div
              className="absolute top-0 left-3/4 h-full w-[2px] bg-gradient-to-b from-transparent via-white/40 to-transparent animate-pulse"
              style={{ animationDelay: "2.5s" }}
            ></div>
          </div>
          {/*==================== End of Animated lines ====================*/}

          {/*==================== Content Slot For the Right Side ====================*/}
          <div className="absolute inset-0 flex flex-col justify-center items-center p-16 text-white z-30">
            {rightSideContent}
          </div>
          {/*==================== End of Content Slot For the Right Side ====================*/}

          {/* Decorative elements */}
          <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-amber-500/20 blur-3xl z-10"></div>
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-blue-400/20 blur-3xl z-10"></div>
        </div>
        {/*==================== End of Right side - Image/Design ====================*/}
      </div>
    </>
  );
};

export default AuthLayout;
