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
      className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-gray-900 to-black"
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
      {/*==================== End of Animated Grid Lines ====================*/}

      {/*==================== Glowing Dots At Intersections ====================*/}
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
      {/*==================== End of Glowing Dots At Intersections ====================*/}

      {/*==================== Content ====================*/}
      <div className="relative z-20 flex h-full flex-col items-center justify-center px-4 text-white">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-8 text-center text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl"
        >
          <span className="text-blue-700">Information</span> Technology{" "}
          <span className="text-amber-500">Communication</span> Association
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-12 grid gap-8 md:grid-cols-2 max-w-4xl"
        >
          {/*==================== Mission Card ====================*/}
          <div className="group relative overflow-hidden rounded-xl border border-blue-700/30 bg-transparent p-6 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-blue-700/60 hover:shadow-lg hover:shadow-blue-700/10">
            <div className="mb-4 flex items-center">
              <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-700/20">
                <Target className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-blue-500">Our Mission</h3>
            </div>
            <p className="text-gray-300">
              To empower students with cutting-edge technology skills and foster
              innovation in the ICT sector through practical learning, industry
              collaboration, and community engagement.
            </p>
            <div className="absolute -bottom-2 -right-2 h-24 w-24 rounded-full bg-blue-700/10 blur-2xl"></div>
          </div>
          {/*==================== End of Mission Card ====================*/}

          {/*==================== Vision Card ====================*/}
          <div className="group relative overflow-hidden rounded-xl border border-amber-500/30 bg-transparent p-6 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-amber-500/60 hover:shadow-lg hover:shadow-amber-500/10">
            <div className="mb-4 flex items-center">
              <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20">
                <Eye className="h-6 w-6 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-amber-500">Our Vision</h3>
            </div>
            <p className="text-gray-300">
              To be the leading technology association that bridges academic
              knowledge with industry practices, creating a generation of tech
              professionals who drive innovation and digital transformation.
            </p>
            <div className="absolute -bottom-2 -right-2 h-24 w-24 rounded-full bg-amber-500/10 blur-2xl"></div>
          </div>
          {/*==================== End of Vision Card ====================*/}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4"
        >
          <button className="group relative overflow-hidden rounded-full bg-blue-700 px-8 py-3 text-white transition-all duration-300 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-700/30">
            <Link
              href={"/#degrees"}
              className="relative z-10 flex items-center"
            >
              Explore Programs
              <ChevronRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <span className="absolute inset-0 -z-10 translate-y-full bg-amber-500 transition-transform duration-300 group-hover:translate-y-0"></span>
          </button>
          <button className="group relative overflow-hidden rounded-full border-2 border-amber-500 bg-transparent px-8 py-3 text-amber-500 transition-all duration-300 hover:text-white hover:shadow-lg hover:shadow-amber-500/30">
            <Link
              href={"/auth/sign-up"}
              className="relative z-10 flex items-center"
            >
              Join ITCA
              <ChevronRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
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
