import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Lock,
  Unlock,
  FileText,
  Video,
  Download,
  ExternalLink,
} from "lucide-react";

type Resource = {
  id: number;
  title: string;
  description: string;
  type: "document" | "video" | "download";
  link: string;
};

const resources: Resource[] = [
  {
    id: 1,
    title: "Introduction to Programming",
    description:
      "Comprehensive guide to programming fundamentals for beginners.",
    type: "document",
    link: "#",
  },
  {
    id: 2,
    title: "Database Design Workshop",
    description: "Video recording of our recent database design workshop.",
    type: "video",
    link: "#",
  },
  {
    id: 3,
    title: "Web Development Toolkit",
    description: "Essential tools and resources for modern web development.",
    type: "download",
    link: "#",
  },
  {
    id: 4,
    title: "Cybersecurity Best Practices",
    description:
      "Guide to protecting your systems and data from cyber threats.",
    type: "document",
    link: "#",
  },
  {
    id: 5,
    title: "Machine Learning Fundamentals",
    description: "Introduction to machine learning concepts and applications.",
    type: "video",
    link: "#",
  },
  {
    id: 6,
    title: "Cloud Computing Templates",
    description: "Ready-to-use templates for various cloud platforms.",
    type: "download",
    link: "#",
  },
];

const ResourcesSection = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleResourceClick = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };

  return (
    <section id="resources" className="relative py-20">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white to-gray-50"></div>
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-blue-700/5"></div>
        <div className="absolute -right-20 top-60 h-60 w-60 rounded-full bg-amber-500/5"></div>
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Learning <span className="text-amber-500">Resources</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Access our collection of learning materials, tools, and resources to
            enhance your ICT knowledge and skills.
          </p>

          <div className="mt-4 flex items-center justify-center">
            {isLoggedIn ? (
              <div className="flex items-center rounded-full bg-green-100 px-4 py-2 text-green-700">
                <Unlock className="mr-2 h-4 w-4" />
                <span className="text-sm font-medium">
                  You are logged in with full access
                </span>
              </div>
            ) : (
              <div className="flex items-center rounded-full bg-amber-100 px-4 py-2 text-amber-700">
                <Lock className="mr-2 h-4 w-4" />
                <span className="text-sm font-medium">
                  Login required to access resources
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {isLoggedIn ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource, index) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group rounded-xl bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl"
              >
                <div className="mb-4">
                  {resource.type === "document" && (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                      <FileText className="h-6 w-6" />
                    </div>
                  )}
                  {resource.type === "video" && (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                      <Video className="h-6 w-6" />
                    </div>
                  )}
                  {resource.type === "download" && (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                      <Download className="h-6 w-6" />
                    </div>
                  )}
                </div>

                <h3 className="mb-2 text-xl font-bold text-gray-900">
                  {resource.title}
                </h3>
                <p className="mb-4 text-gray-600">{resource.description}</p>

                <a
                  href={resource.link}
                  className="inline-flex items-center text-sm font-medium text-blue-700 transition-all hover:text-amber-500"
                >
                  {resource.type === "document" && "View Document"}
                  {resource.type === "video" && "Watch Video"}
                  {resource.type === "download" && "Download Resource"}
                  <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-lg"
          >
            <div className="mb-6 text-center">
              <Lock className="mx-auto mb-4 h-12 w-12 text-amber-500" />
              <h3 className="text-2xl font-bold text-gray-900">
                Resources Require Login
              </h3>
              <p className="mt-2 text-gray-600">
                Please log in to access our comprehensive collection of learning
                resources, tools, and materials.
              </p>
            </div>

            <button
              onClick={handleResourceClick}
              className="group relative mx-auto block w-full overflow-hidden rounded-lg bg-blue-700 px-8 py-3 text-center font-medium text-white transition-all hover:bg-blue-600"
            >
              <span className="relative z-10">Login to Access Resources</span>
              <span className="absolute inset-0 -z-10 translate-y-full bg-amber-500 transition-transform duration-300 group-hover:translate-y-0"></span>
            </button>
          </motion.div>
        )}
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
          >
            <h3 className="mb-4 text-xl font-bold text-gray-900">
              Login to Access Resources
            </h3>

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="group relative overflow-hidden rounded-lg bg-blue-700 px-6 py-2 font-medium text-white transition-all hover:bg-blue-600"
                >
                  <span className="relative z-10">Login</span>
                  <span className="absolute inset-0 -z-10 translate-y-full bg-amber-500 transition-transform duration-300 group-hover:translate-y-0"></span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default ResourcesSection;
