import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, ChevronRight } from "lucide-react";

type Degree = {
  id: number;
  title: string;
  level: "Undergraduate" | "Postgraduate" | "Doctorate";
  duration: string;
  description: string;
  image: string;
  highlights: string[];
};

const degrees: Degree[] = [
  {
    id: 1,
    title: "Computer Science",
    level: "Undergraduate",
    duration: "4 years",
    description:
      "A comprehensive program covering programming, algorithms, data structures, and software engineering principles.",
    image: "/images/degree-1.jpg",
    highlights: [
      "Specializations in AI, Cybersecurity, or Software Engineering",
      "Industry-partnered capstone projects",
      "Internship opportunities with leading tech companies",
    ],
  },
  {
    id: 2,
    title: "Information Technology",
    level: "Undergraduate",
    duration: "4 years",
    description:
      "Focus on practical IT skills including networking, system administration, and database management.",
    image: "/images/degree-2.jpg",
    highlights: [
      "Hands-on technical labs and workshops",
      "Industry certifications preparation",
      "IT infrastructure and cloud computing",
    ],
  },
  {
    id: 3,
    title: "Data Science",
    level: "Postgraduate",
    duration: "2 years",
    description:
      "Advanced study of data analysis, machine learning, and statistical methods for extracting insights from complex datasets.",
    image: "/images/degree-3.jpg",
    highlights: [
      "Big data technologies and frameworks",
      "Predictive modeling and analytics",
      "Research opportunities in emerging fields",
    ],
  },
  {
    id: 4,
    title: "Cybersecurity",
    level: "Postgraduate",
    duration: "2 years",
    description:
      "Specialized program focusing on network security, ethical hacking, digital forensics, and security governance.",
    image: "/images/degree-4.jpg",
    highlights: [
      "Security operations and incident response",
      "Penetration testing and vulnerability assessment",
      "Security architecture and engineering",
    ],
  },
];

const DegreesSection = () => {
  const [activeLevel, setActiveLevel] = useState<string>("all");

  const filteredDegrees =
    activeLevel === "all"
      ? degrees
      : degrees.filter((degree) => degree.level === activeLevel);

  return (
    <section id="degrees" className="relative py-20">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-gray-100 to-white"></div>
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-amber-500/5"></div>
        <div className="absolute -right-20 top-60 h-60 w-60 rounded-full bg-blue-700/5"></div>
        <div className="absolute bottom-20 left-20 h-40 w-40 rounded-full bg-amber-500/5"></div>
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 70 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Our <span className="text-amber-500">Degree</span> Programs
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Explore our comprehensive range of ICT programs designed to prepare
            you for the rapidly evolving technology landscape.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 70 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-10 flex flex-wrap justify-center gap-4"
        >
          <button
            onClick={() => setActiveLevel("all")}
            className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
              activeLevel === "all"
                ? "bg-amber-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Levels
          </button>
          <button
            onClick={() => setActiveLevel("Undergraduate")}
            className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
              activeLevel === "Undergraduate"
                ? "bg-amber-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Undergraduate
          </button>
          <button
            onClick={() => setActiveLevel("Postgraduate")}
            className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
              activeLevel === "Postgraduate"
                ? "bg-amber-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Postgraduate
          </button>
          <button
            onClick={() => setActiveLevel("Doctorate")}
            className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
              activeLevel === "Doctorate"
                ? "bg-amber-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Doctorate
          </button>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          {filteredDegrees.map((degree, index) => (
            <motion.div
              key={degree.id}
              initial={{ opacity: 0, y: 70 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="group relative overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={degree.image || "/placeholder.svg"}
                  alt={degree.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-6">
                  <div className="mb-2 inline-block rounded-full bg-blue-700 px-3 py-1 text-xs font-semibold uppercase text-white">
                    {degree.level}
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    {degree.title}
                  </h3>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4 flex items-center text-sm text-gray-500">
                  <Clock className="mr-2 h-4 w-4 text-amber-500" />
                  <span>Duration: {degree.duration}</span>
                </div>

                <p className="mb-4 text-gray-600">{degree.description}</p>

                <div className="mb-4">
                  <h4 className="mb-2 font-semibold text-gray-900">
                    Program Highlights:
                  </h4>
                  <ul className="space-y-2">
                    {degree.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-start">
                        <ChevronRight className="mr-2 h-4 w-4 shrink-0 text-amber-500" />
                        <span className="text-sm text-gray-600">
                          {highlight}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button className="mt-2 inline-flex items-center text-sm font-medium text-blue-700 transition-all hover:text-amber-500">
                  Learn more about this program
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 70 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <button className="group relative overflow-hidden rounded-full bg-amber-500 px-8 py-3 font-medium text-white transition-all hover:bg-amber-400">
            <span className="relative z-10">View All Programs</span>
            <span className="absolute inset-0 -z-10 translate-y-full bg-blue-700 transition-transform duration-300 group-hover:translate-y-0"></span>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default DegreesSection;
