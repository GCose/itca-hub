import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  ChevronRight,
  BookOpen,
  Check,
  Code,
  Database,
  Radio,
} from "lucide-react";

type Degree = {
  id: number;
  title: string;
  level: "Undergraduate";
  duration: string;
  description: string;
  image: string;
  highlights: string[];
  icon: React.ReactNode;
};

const degrees: Degree[] = [
  {
    id: 1,
    title: "Computer Science",
    level: "Undergraduate",
    duration: "4 years",
    description:
      "A comprehensive program covering programming, algorithms, data structures, and software engineering principles. Develop the technical skills necessary to design and build software systems that power today's digital economy.",
    image: "/images/degree-1.jpg",
    highlights: [
      "Specializations in AI, Cybersecurity, or Software Engineering",
      "Industry-partnered capstone projects",
      "Internship opportunities with leading tech companies",
      "Strong foundation in computational theory and practice",
      "Advanced algorithms and data structures",
    ],
    icon: <Code className="w-5 h-5" />,
  },
  {
    id: 2,
    title: "Information Systems",
    level: "Undergraduate",
    duration: "4 years",
    description:
      "Focus on bridging technology and business needs by designing, implementing, and managing information systems that support organizational operations. Learn to analyze business problems and develop technology solutions.",
    image: "/images/degree-2.jpg",
    highlights: [
      "Business process modeling and analysis",
      "Database design and management",
      "Project management methodologies",
      "Enterprise systems integration",
      "IT service management",
    ],
    icon: <Database className="w-5 h-5" />,
  },
  {
    id: 3,
    title: "Telecommunications",
    level: "Undergraduate",
    duration: "4 years",
    description:
      "Master the science and technology of communication at a distance through electronic transmission of information. Focus on network design, wireless communications, signal processing, and telecommunications infrastructure.",
    image: "/images/degree-3.jpg",
    highlights: [
      "Network architecture and protocols",
      "Wireless communications systems",
      "Signal processing techniques",
      "Optical communication technologies",
      "Telecommunications regulations and standards",
    ],
    icon: <Radio className="w-5 h-5" />,
  },
];

const DegreesSection = () => {
  const [selectedDegree, setSelectedDegree] = useState<Degree | null>(null);

  return (
    <section id="degrees" className="relative py-24 overflow-hidden">
      {/* Dynamic Background with geometric shapes */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-gray-50 to-gray-100"></div>

      {/* Prominent Geometric Elements - Top Right */}
      <div className="absolute top-0 right-0 w-2/3 h-full overflow-hidden -z-5">
        <div className="absolute top-10 right-0 w-full h-full">
          <div className="absolute top-10 right-[-200px] h-[500px] w-[500px] rounded-full border-[40px] border-amber-500/5 animate-pulse"></div>
          <div
            className="absolute top-40 right-[-150px] h-[400px] w-[400px] rounded-full border-[30px] border-blue-700/5 animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-60 right-[-100px] h-[300px] w-[300px] rounded-full border-[20px] border-amber-500/5 animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>
      </div>

      {/* Prominent Geometric Elements - Bottom Left (as requested) */}
      <div className="absolute bottom-0 left-0 w-2/3 h-full overflow-hidden -z-5">
        <div className="absolute bottom-10 left-0 w-full h-full">
          <div
            className="absolute bottom-10 left-[-200px] h-[500px] w-[500px] rounded-full border-[40px] border-blue-700/5 animate-pulse"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div
            className="absolute bottom-40 left-[-150px] h-[400px] w-[400px] rounded-full border-[30px] border-amber-500/5 animate-pulse"
            style={{ animationDelay: "1.5s" }}
          ></div>
          <div
            className="absolute bottom-60 left-[-100px] h-[300px] w-[300px] rounded-full border-[20px] border-blue-700/5 animate-pulse"
            style={{ animationDelay: "2.5s" }}
          ></div>
        </div>
      </div>

      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-br from-blue-700/5 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-tr from-amber-500/5 to-transparent rounded-full blur-2xl"></div>
      <div className="absolute bottom-40 right-10 w-64 h-64 bg-gradient-to-tl from-blue-700/5 to-transparent rounded-full blur-2xl"></div>

      {/* Pattern Background */}
      <div
        className="absolute inset-0 -z-5 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      ></div>

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 70 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="inline-block text-blue-700 font-semibold mb-2">
            ACADEMIC EXCELLENCE
          </span>
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Our <span className="text-amber-500">Undergraduate</span> Programs
          </h2>
          <div className="mx-auto h-1 w-24 bg-gradient-to-r from-blue-700 via-amber-500 to-blue-700 rounded-full mb-6"></div>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Explore our comprehensive undergraduate degree programs designed to
            prepare you for the rapidly evolving technology landscape.
          </p>
        </motion.div>

        {/* Icon-only Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex justify-center max-w-3xl mx-auto">
            {degrees.map((degree, index) => (
              <motion.div
                key={degree.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className={`relative group cursor-pointer transition-all duration-300 ${
                  selectedDegree?.id === degree.id
                    ? "flex-1 max-w-[180px]"
                    : "flex-1 max-w-[150px]"
                }`}
                onClick={() => setSelectedDegree(degree)}
              >
                <div className="relative flex flex-col items-center px-2">
                  {/* Icon Circle - Smaller and More Compact */}
                  <div
                    className={`flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 ${
                      selectedDegree?.id === degree.id
                        ? "bg-blue-700 text-white shadow-lg shadow-blue-700/30"
                        : "bg-white text-gray-500 border-2 border-gray-200 group-hover:border-blue-700/50 group-hover:text-blue-700"
                    }`}
                  >
                    {degree.icon}
                  </div>

                  {/* Pulse Animation when selected */}
                  {selectedDegree?.id === degree.id && (
                    <div className="absolute inset-0 -z-10 flex items-center justify-center">
                      <div
                        className="absolute w-14 h-14 rounded-full bg-blue-700/20 animate-pulse"
                        style={{
                          transformOrigin: "center",
                          transform: "scale(1.2)",
                        }}
                      ></div>
                      <div
                        className="absolute w-14 h-14 rounded-full bg-blue-700/10 animate-pulse"
                        style={{
                          animationDelay: "0.5s",
                          transformOrigin: "center",
                          transform: "scale(1.4)",
                        }}
                      ></div>
                    </div>
                  )}

                  {/* Title - More Compact */}
                  <h4
                    className={`text-center font-bold text-sm mt-2 transition-colors ${
                      selectedDegree?.id === degree.id
                        ? "text-blue-700"
                        : "text-gray-800 group-hover:text-blue-700"
                    }`}
                  >
                    {degree.title}
                  </h4>

                  {/* Duration - Smaller and Inline */}
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    <span className="whitespace-nowrap">{degree.duration}</span>
                  </div>

                  {/* Active Indicator Line */}
                  {selectedDegree?.id === degree.id && (
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-blue-700 rounded-full"></div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Program Details View */}
        <AnimatePresence mode="wait">
          {selectedDegree ? (
            <motion.div
              key={selectedDegree.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden mx-auto max-w-5xl"
            >
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-2/5 relative">
                  <div className="h-64 lg:h-full w-full relative">
                    <Image
                      src={selectedDegree.image || "/placeholder.svg"}
                      alt={selectedDegree.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent lg:bg-gradient-to-t"></div>
                    <div className="absolute bottom-0 left-0 w-full p-6 z-10">
                      <div className="mb-2 inline-block rounded-full bg-blue-700 px-3 py-1 text-xs font-semibold uppercase text-white">
                        {selectedDegree.level}
                      </div>
                      <h3 className="text-3xl font-bold text-white">
                        {selectedDegree.title}
                      </h3>
                      <div className="mt-2 flex items-center text-sm text-gray-200">
                        <Clock className="mr-2 h-4 w-4 text-amber-400" />
                        <span>Duration: {selectedDegree.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:w-3/5 p-8">
                  <div className="mb-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-4">
                      Program Overview
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedDegree.description}
                    </p>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-4">
                      What You{"'"}ll Learn
                    </h4>
                    <ul className="space-y-3">
                      {selectedDegree.highlights.map((highlight, i) => (
                        <li key={i} className="flex items-start">
                          <Check className="mr-3 h-5 w-5 text-amber-500 flex-shrink-0" />
                          <span className="text-gray-700">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <button className="group relative overflow-hidden rounded-full bg-amber-500 px-6 py-3 font-medium text-white transition-all hover:shadow-lg hover:shadow-amber-500/30">
                      <span className="relative z-10 flex items-center">
                        Learn more about this program
                        <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                      <span className="absolute inset-0 -z-10 translate-y-full bg-blue-700 transition-transform duration-300 group-hover:translate-y-0"></span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-8 flex flex-col items-center justify-center min-h-[300px] max-w-3xl mx-auto"
            >
              <BookOpen className="w-16 h-16 text-blue-700/20 mb-6" />
              <h3 className="text-xl font-medium text-gray-400 mb-4 text-center">
                Select a program to view details
              </h3>
              <p className="text-gray-400 text-center max-w-md">
                Click on one of the program icons above to explore our
                undergraduate offerings and discover which path is right for
                you.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default DegreesSection;
