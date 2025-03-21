import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react";

type Event = {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  category: "workshop" | "conference" | "hackathon" | "seminar";
};

const events: Event[] = [
  {
    id: 1,
    title: "Annual Tech Conference 2023",
    date: "November 15, 2023",
    time: "9:00 AM - 5:00 PM",
    location: "Main Auditorium",
    description:
      "Join us for our annual technology conference featuring industry leaders and innovative showcases.",
    image: "/images/event-1.jpg",
    category: "conference",
  },
  {
    id: 2,
    title: "Web Development Workshop",
    date: "October 25, 2023",
    time: "2:00 PM - 4:00 PM",
    location: "Lab 302",
    description:
      "Hands-on workshop on modern web development techniques and frameworks.",
    image: "/images/event-2.jpg",
    category: "workshop",
  },
  {
    id: 3,
    title: "Cybersecurity Hackathon",
    date: "December 5-7, 2023",
    time: "All day",
    location: "ICT Building",
    description:
      "A 48-hour hackathon focused on solving real-world cybersecurity challenges.",
    image: "/images/event-3.jpg",
    category: "hackathon",
  },
  {
    id: 4,
    title: "AI & Machine Learning Seminar",
    date: "November 10, 2023",
    time: "3:00 PM - 5:00 PM",
    location: "Virtual (Zoom)",
    description:
      "Learn about the latest advancements in AI and machine learning from industry experts.",
    image: "/images/event-1.jpg",
    category: "seminar",
  },
];

const EventsSection = () => {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filteredEvents =
    activeFilter === "all"
      ? events
      : events.filter((event) => event.category === activeFilter);

  return (
    <section id="events" className="relative py-20">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white to-gray-100"></div>
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-blue-700/5"></div>
        <div className="absolute -left-20 top-60 h-60 w-60 rounded-full bg-amber-500/5"></div>
        <div className="absolute bottom-20 right-20 h-40 w-40 rounded-full bg-blue-700/5"></div>
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
            Upcoming <span className="text-blue-700">Events</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Stay updated with our latest workshops, conferences, and activities
            designed to enhance your skills and knowledge.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-10 flex flex-wrap justify-center gap-4"
        >
          <button
            onClick={() => setActiveFilter("all")}
            className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
              activeFilter === "all"
                ? "bg-blue-700 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Events
          </button>
          <button
            onClick={() => setActiveFilter("workshop")}
            className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
              activeFilter === "workshop"
                ? "bg-blue-700 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Workshops
          </button>
          <button
            onClick={() => setActiveFilter("conference")}
            className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
              activeFilter === "conference"
                ? "bg-blue-700 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Conferences
          </button>
          <button
            onClick={() => setActiveFilter("hackathon")}
            className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
              activeFilter === "hackathon"
                ? "bg-blue-700 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Hackathons
          </button>
          <button
            onClick={() => setActiveFilter("seminar")}
            className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
              activeFilter === "seminar"
                ? "bg-blue-700 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Seminars
          </button>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="group relative overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex flex-col md:flex-row">
                <div className="relative h-60 w-full overflow-hidden md:h-auto md:w-2/5">
                  <Image
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold uppercase text-white">
                    {event.category}
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <h3 className="mb-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-700">
                      {event.title}
                    </h3>
                    <p className="mb-4 text-gray-600">{event.description}</p>

                    <div className="mb-1 flex items-center text-sm text-gray-500">
                      <Calendar className="mr-2 h-4 w-4 text-amber-500" />
                      {event.date}
                    </div>
                    <div className="mb-1 flex items-center text-sm text-gray-500">
                      <Clock className="mr-2 h-4 w-4 text-amber-500" />
                      {event.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="mr-2 h-4 w-4 text-amber-500" />
                      {event.location}
                    </div>
                  </div>

                  <div className="mt-4">
                    <button className="group/btn flex items-center text-sm font-medium text-blue-700 transition-all hover:text-amber-500">
                      Learn more
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <button className="group relative overflow-hidden rounded-full bg-blue-700 px-8 py-3 font-medium text-white transition-all hover:bg-blue-600">
            <span className="relative z-10">View All Events</span>
            <span className="absolute inset-0 -z-10 translate-y-full bg-amber-500 transition-transform duration-300 group-hover:translate-y-0"></span>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default EventsSection;
