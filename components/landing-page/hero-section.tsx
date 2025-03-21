import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDownCircle } from "lucide-react";

const HeroSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.7;
    }
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-gray-900 to-black">
      {/*==================== Background video with overlay ====================*/}
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
      {/*==================== End of Background video with overlay ====================*/}

      {/*==================== Animated grid lines ====================*/}
      <div className="absolute inset-0 z-10 overflow-hidden">
        {/* Horizontal animated lines */}
        <div className="absolute top-1/4 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-amber-500/60 to-transparent animate-pulse"></div>
        <div
          className="absolute top-2/4 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-blue-700/60 to-transparent animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-3/4 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-amber-500/60 to-transparent animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Vertical animated lines */}
        <div className="absolute top-0 left-1/4 h-full w-[2px] bg-gradient-to-b from-transparent via-blue-700/60 to-transparent animate-pulse"></div>
        <div
          className="absolute top-0 left-2/4 h-full w-[2px] bg-gradient-to-b from-transparent via-amber-500/60 to-transparent animate-pulse"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute top-0 left-3/4 h-full w-[2px] bg-gradient-to-b from-transparent via-blue-700/60 to-transparent animate-pulse"
          style={{ animationDelay: "2.5s" }}
        ></div>
      </div>
      {/*==================== End of Animated grid lines ====================*/}

      {/*==================== Glowing dots at intersections ====================*/}
      <div className="absolute inset-0 z-10">
        <div className="absolute top-1/4 left-1/4 h-3 w-3 rounded-full bg-blue-500/70 animate-pulse shadow-lg shadow-blue-500/50"></div>
        <div
          className="absolute top-1/4 left-2/4 h-3 w-3 rounded-full bg-amber-500/70 animate-pulse shadow-lg shadow-amber-500/50"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute top-1/4 left-3/4 h-3 w-3 rounded-full bg-blue-500/70 animate-pulse shadow-lg shadow-blue-500/50"
          style={{ animationDelay: "1s" }}
        ></div>

        <div
          className="absolute top-2/4 left-1/4 h-3 w-3 rounded-full bg-amber-500/70 animate-pulse shadow-lg shadow-amber-500/50"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute top-2/4 left-2/4 h-3 w-3 rounded-full bg-blue-500/70 animate-pulse shadow-lg shadow-blue-500/50"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-2/4 left-3/4 h-3 w-3 rounded-full bg-amber-500/70 animate-pulse shadow-lg shadow-amber-500/50"
          style={{ animationDelay: "2.5s" }}
        ></div>

        <div
          className="absolute top-3/4 left-1/4 h-3 w-3 rounded-full bg-blue-500/70 animate-pulse shadow-lg shadow-blue-500/50"
          style={{ animationDelay: "3s" }}
        ></div>
        <div
          className="absolute top-3/4 left-2/4 h-3 w-3 rounded-full bg-amber-500/70 animate-pulse shadow-lg shadow-amber-500/50"
          style={{ animationDelay: "3.5s" }}
        ></div>
        <div
          className="absolute top-3/4 left-3/4 h-3 w-3 rounded-full bg-blue-500/70 animate-pulse shadow-lg shadow-blue-500/50"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>
      {/*==================== End of Glowing dots at intersections ====================*/}

      {/*==================== Content ====================*/}
      <div className="relative z-20 flex h-full flex-col items-center justify-center px-4 text-white">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-4 text-center text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl"
        >
          <span className="text-blue-700">Information</span> Technology{" "}
          <span className="text-amber-500">Communication</span> Association
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-8 max-w-3xl text-center text-lg text-gray-300 md:text-xl"
        >
          <p className="mb-4">
            <span className="font-semibold text-amber-500">Our Mission:</span>{" "}
            To empower students with cutting-edge technology skills and foster
            innovation in the ICT sector.
          </p>
          <p>
            <span className="font-semibold text-blue-700">Our Vision:</span> To
            be the leading technology association that bridges academic
            knowledge with industry practices.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4"
        >
          <button className="group relative overflow-hidden rounded-full bg-blue-700 px-8 py-3 text-white transition-all duration-300 hover:bg-blue-600">
            <span className="relative z-10">Explore Programs</span>
            <span className="absolute inset-0 -z-10 translate-y-full bg-amber-500 transition-transform duration-300 group-hover:translate-y-0"></span>
          </button>
          <button className="group relative overflow-hidden rounded-full border-2 border-amber-500 bg-transparent px-8 py-3 text-amber-500 transition-all duration-300 hover:text-white">
            <span className="relative z-10">Join ITCA</span>
            <span className="absolute inset-0 -z-10 translate-y-full bg-amber-500 transition-transform duration-300 group-hover:translate-y-0"></span>
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8"
        >
          <ArrowDownCircle className="h-10 w-10 animate-float text-amber-500" />
        </motion.div>
      </div>
      {/*==================== End of Content ====================*/}
    </section>
  );
};

export default HeroSection;
