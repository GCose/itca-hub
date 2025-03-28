import { useState, useRef, useEffect } from "react";
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
  Users,
  GraduationCap,
  ArrowRight,
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
  const [hoveredTab, setHoveredTab] = useState<number | null>(null);
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Initialize with first degree on component mount
  useEffect(() => {
    if (!selectedDegree && degrees.length > 0) {
      setSelectedDegree(degrees[0]);
    }
  }, [selectedDegree]);

  return (
    <section id="degrees" className="relative py-24 overflow-hidden">
      {/*==================== Dynamic Background with geometric shapes ====================*/}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-gray-50 to-gray-100"></div>

      {/*==================== Prominent Geometric Elements - Top Right ====================*/}
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
      {/*==================== End of Prominent Geometric Elements - Top Right ====================*/}

      {/*==================== Prominent Geometric Elements - Bottom Left ====================*/}
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
      {/*==================== End of Prominent Geometric Elements - Bottom Left ====================*/}

      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-br from-blue-700/5 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-tr from-amber-500/5 to-transparent rounded-full blur-2xl"></div>
      <div className="absolute bottom-40 right-10 w-64 h-64 bg-gradient-to-tl from-blue-700/5 to-transparent rounded-full blur-2xl"></div>

      {/*==================== Pattern Background ====================*/}
      <div
        className="absolute inset-0 -z-5 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      ></div>
      {/*==================== End of Pattern Background ====================*/}

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

        {/*==================== Tab Navigation ====================*/}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16 relative"
        >
          <div className="relative flex justify-center mx-auto max-w-4xl backdrop-blur-sm rounded-2xl p-2 bg-white/30 border border-white/40 shadow-lg shadow-blue-700/5">
            {/*==================== Active Tab Indicator - Animated Background ====================*/}
            {selectedDegree && (
              <motion.div
                initial={false}
                animate={{
                  x: tabRefs.current[selectedDegree.id - 1]?.offsetLeft || 0,
                  width:
                    tabRefs.current[selectedDegree.id - 1]?.offsetWidth || 0,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute top-0 left-0 h-full z-0 rounded-xl bg-gradient-to-r from-blue-700/90 to-blue-600/90 shadow-md"
              />
            )}

            {degrees.map((degree, index) => (
              <motion.div
                key={degree.id}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                className={`relative z-10 px-8 py-4 cursor-pointer transition-all duration-300 flex-1 flex flex-col items-center rounded-xl
                  ${selectedDegree?.id === degree.id ? "text-white" : "text-gray-700 hover:text-blue-700"}`}
                onClick={() => setSelectedDegree(degree)}
                onMouseEnter={() => setHoveredTab(degree.id)}
                onMouseLeave={() => setHoveredTab(null)}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className={`flex items-center justify-center mb-2 transition-all duration-300 ${
                    selectedDegree?.id === degree.id
                      ? "scale-110"
                      : hoveredTab === degree.id
                        ? "scale-105"
                        : ""
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      selectedDegree?.id === degree.id
                        ? "bg-white/20"
                        : "bg-blue-100"
                    }`}
                  >
                    {degree.icon}
                  </div>
                </div>

                <h3 className="font-bold text-lg">{degree.title}</h3>

                <div className="flex items-center mt-1 text-xs opacity-80">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>{degree.duration}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        {/*==================== End of Tab Navigation ====================*/}

        {/*==================== Program Details ====================*/}
        <AnimatePresence mode="wait">
          {selectedDegree ? (
            <motion.div
              key={selectedDegree.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden mx-auto max-w-5xl border border-white/50"
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

                    {/*==================== Dark gradient overlay ====================*/}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent lg:bg-gradient-to-t"></div>

                    {/*==================== Content overlay ====================*/}
                    <div className="absolute bottom-0 left-0 w-full p-6 z-10">
                      <div className="mb-2 inline-block px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-700 to-blue-600 text-xs font-semibold uppercase text-white shadow-md">
                        {selectedDegree.level}
                      </div>

                      <h3 className="text-3xl font-bold text-white mb-1 drop-shadow-md">
                        {selectedDegree.title}
                      </h3>

                      <div className="mt-3 flex items-center text-sm">
                        <div className="flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                          <Clock className="mr-2 h-4 w-4 text-amber-400" />
                          <span className="text-white font-medium">
                            Duration: {selectedDegree.duration}
                          </span>
                        </div>

                        <div className="flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full ml-2">
                          <Users className="mr-2 h-4 w-4 text-amber-400" />
                          <span className="text-white font-medium">
                            200+ Students
                          </span>
                        </div>
                      </div>
                    </div>
                    {/*==================== End of Content overlay ====================*/}
                  </div>
                </div>

                <div className="lg:w-3/5 p-8">
                  <div className="mb-6">
                    <div className="flex items-center mb-4">
                      <GraduationCap className="w-6 h-6 text-blue-700 mr-2" />
                      <h4 className="text-xl font-bold text-gray-900">
                        Program Overview
                      </h4>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedDegree.description}
                    </p>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <BookOpen className="w-5 h-5 text-amber-500 mr-2" />
                      What You{"'"}ll Learn
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedDegree.highlights.map((highlight, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.1 }}
                          className="flex items-start p-3 rounded-lg bg-gradient-to-r from-gray-50 to-white border border-gray-100"
                        >
                          <div className="mr-3 mt-0.5 h-5 w-5 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                            <Check className="h-3 w-3 text-green-600" />
                          </div>
                          <span className="text-gray-700 text-sm">
                            {highlight}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                    <button className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-700 to-blue-600 px-6 py-3 font-medium text-white transition-all hover:shadow-lg hover:shadow-blue-500/30 flex items-center">
                      <span className="relative z-10 flex items-center">
                        Program Details
                        <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                      <span className="absolute inset-0 -z-10 translate-y-full bg-gradient-to-r from-amber-500 to-amber-400 transition-transform duration-300 group-hover:translate-y-0"></span>
                    </button>

                    <button className="group px-6 py-3 font-medium text-blue-700 hover:text-blue-600 transition-all flex items-center">
                      <span className="relative z-10 flex items-center">
                        Download Brochure
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
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
        {/*==================== End of Program Details ====================*/}
      </div>
    </section>
  );
};

export default DegreesSection;
