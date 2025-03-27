import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, Info, BookOpen, FileText, ArrowRight } from "lucide-react";

const QuickLinks = () => {
  const links = [
    {
      title: "Events",
      description:
        "Stay updated with our upcoming workshops, conferences, and activities.",
      icon: <Calendar className="h-8 w-8" />,
      href: "#events",
      color: "bg-gradient-to-br from-blue-500 to-blue-700",
    },
    {
      title: "About Us",
      description: "Learn more about ITCA's mission, vision, and team.",
      icon: <Info className="h-8 w-8" />,
      href: "#about",
      color: "bg-gradient-to-br from-yellow-500 to-yellow-700",
    },
    {
      title: "Degrees",
      description: "Explore our comprehensive range of ICT programs.",
      icon: <BookOpen className="h-8 w-8" />,
      href: "#degrees",
      color: "bg-gradient-to-br from-blue-500 to-blue-700",
    },
    {
      title: "Resources",
      description:
        "Access learning materials, tools, and resources (login required).",
      icon: <FileText className="h-8 w-8" />,
      href: "#resources",
      color: "bg-gradient-to-br from-yellow-500 to-yellow-700",
    },
  ];

  return (
    <section className="relative py-16">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white to-gray-50"></div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 70 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Quick <span className="text-blue-700">Navigation</span>
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600">
            Find what you are looking for with our easy navigation shortcuts
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {links.map((link, index) => (
            <motion.div
              key={link.title}
              initial={{ opacity: 0, y: 70 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={link.href}
                className="group flex h-full flex-col rounded-xl bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl"
              >
                <div
                  className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ${link.color} text-white`}
                >
                  {link.icon}
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">
                  {link.title}
                </h3>
                <p className="mb-4 flex-grow text-gray-600">
                  {link.description}
                </p>
                <div className="mt-auto flex items-center text-sm font-medium text-blue-700 transition-all group-hover:text-amber-500">
                  Navigate
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickLinks;
