import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowDownCircle, Target, Eye, ChevronRight } from "lucide-react";
import Link from "next/link";

const HeroSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.7;
    }
  }, []);

  return (
    <section
      id="hero-section"
      className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-gray-900 to-black"
    >
      {/*==================== Background Video With Overlay ====================*/}
      <div className="absolute inset-0 z-0">
        <video
          loop
          muted
          autoPlay
          playsInline
          ref={videoRef}
          className="h-full w-full object-cover opacity-40"
        >
          <source type="video/mp4" src="/videos/hero-vid.mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-transparent to-gray-900/80"></div>
      </div>
      {/*==================== End of Background Video With Overlay ====================*/}

      {/*==================== Animated Grid Lines ====================*/}
      <div className="absolute inset-0 z-10 overflow-hidden">
        {/* Horizontal animated lines */}
        <div className="absolute top-1/4 left-0 h-[1px] sm:h-[2px] w-full bg-gradient-to-r from-transparent via-amber-500/60 to-transparent animate-pulse"></div>
        <div
          style={{ animationDelay: "1s" }}
          className="absolute top-2/4 left-0 h-[1px] sm:h-[2px] w-full bg-gradient-to-r from-transparent via-blue-700/60 to-transparent animate-pulse"
        ></div>
        <div
          style={{ animationDelay: "2s" }}
          className="absolute top-3/4 left-0 h-[1px] sm:h-[2px] w-full bg-gradient-to-r from-transparent via-amber-500/60 to-transparent animate-pulse"
        ></div>

        {/* Vertical animated lines */}
        <div className="absolute top-0 left-1/4 h-full w-[1px] sm:w-[2px] bg-gradient-to-b from-transparent via-blue-700/60 to-transparent animate-pulse"></div>
        <div
          style={{ animationDelay: "1.5s" }}
          className="absolute top-0 left-2/4 h-full w-[1px] sm:w-[2px] bg-gradient-to-b from-transparent via-amber-500/60 to-transparent animate-pulse"
        ></div>
        <div
          style={{ animationDelay: "2.5s" }}
          className="absolute top-0 left-3/4 h-full w-[1px] sm:w-[2px] bg-gradient-to-b from-transparent via-blue-700/60 to-transparent animate-pulse"
        ></div>
      </div>
      {/*==================== End of Animated Grid Lines ====================*/}

      {/*==================== Glowing Dots At Intersections ====================*/}
      <div className="absolute inset-0 z-10">
        {/* First row */}
        <div className="absolute top-1/4 left-1/4 h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-blue-500/70 animate-pulse shadow-lg shadow-blue-500/50"></div>
        <div
          className="absolute top-1/4 left-2/4 h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-amber-500/70 animate-pulse shadow-lg shadow-amber-500/50"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute top-1/4 left-3/4 h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-blue-500/70 animate-pulse shadow-lg shadow-blue-500/50"
          style={{ animationDelay: "1s" }}
        ></div>

        {/* Second row */}
        <div
          className="absolute top-2/4 left-1/4 h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-amber-500/70 animate-pulse shadow-lg shadow-amber-500/50"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute top-2/4 left-2/4 h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-blue-500/70 animate-pulse shadow-lg shadow-blue-500/50"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-2/4 left-3/4 h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-amber-500/70 animate-pulse shadow-lg shadow-amber-500/50"
          style={{ animationDelay: "2.5s" }}
        ></div>

        {/* Third row */}
        <div
          className="absolute top-3/4 left-1/4 h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-blue-500/70 animate-pulse shadow-lg shadow-blue-500/50"
          style={{ animationDelay: "3s" }}
        ></div>
        <div
          className="absolute top-3/4 left-2/4 h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-amber-500/70 animate-pulse shadow-lg shadow-amber-500/50"
          style={{ animationDelay: "3.5s" }}
        ></div>
        <div
          className="absolute top-3/4 left-3/4 h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-blue-500/70 animate-pulse shadow-lg shadow-blue-500/50"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>
      {/*==================== End of Glowing Dots At Intersections ====================*/}

      {/*==================== Content ====================*/}
      <div className="relative z-20 flex h-full min-h-screen flex-col items-center justify-center px-4 py-16 sm:py-24 md:py-32 text-white">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-4 sm:mb-6 md:mb-8 text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight"
        >
          <span className="text-blue-700">Information</span>{" "}
          <span className="xs:inline">Technology</span>{" "}
          <span className="text-amber-500">Communication</span>{" "}
          <span className="block xs:inline">Association</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 70 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-6 sm:mb-8 md:mb-12 grid gap-4 sm:gap-6 md:gap-8 md:grid-cols-2 w-full max-w-4xl px-2 sm:px-4"
        >
          {/*==================== Mission Card ====================*/}
          <div className="group relative overflow-hidden rounded-xl border border-blue-700/30 bg-transparent p-4 sm:p-6 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-blue-700/60 hover:shadow-lg hover:shadow-blue-700/10">
            <div className="mb-2 sm:mb-4 flex items-center">
              <div className="mr-3 sm:mr-4 flex h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-blue-700/20">
                <Target className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-blue-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-blue-500">
                Our Mission
              </h3>
            </div>
            <p className="text-sm sm:text-base text-gray-300">
              To empower students with cutting-edge technology skills and foster
              innovation in the ICT sector through practical learning, industry
              collaboration, and community engagement.
            </p>
            <div className="absolute -bottom-2 -right-2 h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 rounded-full bg-blue-700/10 blur-2xl"></div>
          </div>
          {/*==================== End of Mission Card ====================*/}

          {/*==================== Vision Card ====================*/}
          <div className="group relative overflow-hidden rounded-xl border border-amber-500/30 bg-transparent p-4 sm:p-6 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-amber-500/60 hover:shadow-lg hover:shadow-amber-500/10">
            <div className="mb-2 sm:mb-4 flex items-center">
              <div className="mr-3 sm:mr-4 flex h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-amber-500/20">
                <Eye className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-amber-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-amber-500">
                Our Vision
              </h3>
            </div>
            <p className="text-sm sm:text-base text-gray-300">
              To be the leading technology association that bridges academic
              knowledge with industry practices, creating a generation of tech
              professionals who drive innovation and digital transformation.
            </p>
            <div className="absolute -bottom-2 -right-2 h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 rounded-full bg-amber-500/10 blur-2xl"></div>
          </div>
          {/*==================== End of Vision Card ====================*/}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 70 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex sm:flex-col w-full max-w-xs sm:max-w-md space-y-3 sm:space-y-4 xs:space-y-0 xs:space-x-3 sm:space-x-4 justify-center"
        >
          <button className="group relative overflow-hidden rounded-full bg-blue-700 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base text-white transition-all duration-300 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-700/30">
            <Link
              href={"/#degrees"}
              className="relative z-10 flex items-center justify-center"
            >
              Explore Programs
              <ChevronRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <span className="absolute inset-0 -z-10 translate-y-full bg-amber-500 transition-transform duration-300 group-hover:translate-y-0"></span>
          </button>
          <button className="group relative overflow-hidden rounded-full border-2 border-amber-500 bg-transparent px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base text-amber-500 transition-all duration-300 hover:text-white hover:shadow-lg hover:shadow-amber-500/30">
            <Link
              href={"/auth/sign-up"}
              className="relative z-10 flex items-center justify-center"
            >
              Join ITCA
              <ChevronRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <span className="absolute inset-0 -z-10 translate-y-full bg-amber-500 transition-transform duration-300 group-hover:translate-y-0"></span>
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-4 sm:bottom-6 md:bottom-8 hidden xs:block"
        >
          <ArrowDownCircle className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 animate-float text-amber-500" />
        </motion.div>
      </div>
      {/*==================== End of Content ====================*/}
    </section>
  );
};

export default HeroSection;
