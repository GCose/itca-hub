"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import Link from "next/link";

const ResourcesSection = () => {
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
            <div className="flex items-center rounded-full bg-amber-100 px-4 py-2 text-amber-700">
              <Lock className="mr-2 h-4 w-4" />
              <span className="text-sm font-medium">
                Login required to access resources
              </span>
            </div>
          </div>
        </motion.div>

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

          <Link
            href={"/auth"}
            className="group relative mx-auto block w-full overflow-hidden rounded-lg bg-blue-700 px-8 py-3 text-center font-medium text-white transition-all hover:bg-blue-600"
          >
            <span className="relative z-10">Login to Access Resources</span>
            <span className="absolute inset-0 -z-10 translate-y-full bg-amber-500 transition-transform duration-300 group-hover:translate-y-0"></span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ResourcesSection;
