import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, MapPin, ArrowRight, Bookmark } from "lucide-react";

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
  const [animateCards, setAnimateCards] = useState(true);

  const filteredEvents =
    activeFilter === "all"
      ? events
      : events.filter((event) => event.category === activeFilter);

  useEffect(() => {
    // Reset animation state when filter changes
    setAnimateCards(false);
    setTimeout(() => setAnimateCards(true), 10);
  }, [activeFilter]);

  return (
    <section
      id="events"
      className="relative py-24 overflow-hidden bg-gradient-to-b from-white to-gray-100"
    >
      {/*==================== Animated Grid Lines ====================*/}
      <div className="absolute inset-0 z-10 overflow-hidden opacity-30">
        {/*==================== Horizontal Animated lines ====================*/}
        <div className="absolute top-1/4 left-0 h-[1px] sm:h-[2px] w-full bg-gradient-to-r from-transparent via-amber-500/60 to-transparent animate-pulse"></div>
        <div
          style={{ animationDelay: "1s" }}
          className="absolute top-2/4 left-0 h-[1px] sm:h-[2px] w-full bg-gradient-to-r from-transparent via-blue-700/60 to-transparent animate-pulse"
        ></div>
        <div
          style={{ animationDelay: "2s" }}
          className="absolute top-3/4 left-0 h-[1px] sm:h-[2px] w-full bg-gradient-to-r from-transparent via-amber-500/60 to-transparent animate-pulse"
        ></div>

        {/*==================== Vertical Animated lines ====================*/}
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

      {/*==================== Light Background Elements ====================*/}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-blue-700/5"></div>
        <div className="absolute -left-20 top-60 h-60 w-60 rounded-full bg-amber-500/5"></div>
        <div className="absolute bottom-20 right-20 h-40 w-40 rounded-full bg-blue-700/5"></div>
      </div>
      {/*==================== End of Light Background Elements ====================*/}

      {/*==================== Glowing Dots At Intersections ====================*/}
      <div className="absolute inset-0 z-10 opacity-70">
        {/*==================== First Row ====================*/}
        <div className="absolute top-1/4 left-1/4 h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-blue-500/40 animate-pulse shadow-sm shadow-blue-500/30"></div>
        <div
          className="absolute top-1/4 left-2/4 h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-amber-500/40 animate-pulse shadow-sm shadow-amber-500/30"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute top-1/4 left-3/4 h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-blue-500/40 animate-pulse shadow-sm shadow-blue-500/30"
          style={{ animationDelay: "1s" }}
        ></div>
        {/*==================== End of First Row ====================*/}

        {/*==================== Second Row ====================*/}
        <div
          className="absolute top-2/4 left-1/4 h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-amber-500/40 animate-pulse shadow-sm shadow-amber-500/30"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute top-2/4 left-2/4 h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-blue-500/40 animate-pulse shadow-sm shadow-blue-500/30"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-2/4 left-3/4 h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-amber-500/40 animate-pulse shadow-sm shadow-amber-500/30"
          style={{ animationDelay: "2.5s" }}
        ></div>
        {/*==================== End of Second Row ====================*/}

        {/*==================== Third row ====================*/}
        <div
          className="absolute top-3/4 left-1/4 h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-blue-500/40 animate-pulse shadow-sm shadow-blue-500/30"
          style={{ animationDelay: "3s" }}
        ></div>
        <div
          className="absolute top-3/4 left-2/4 h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-amber-500/40 animate-pulse shadow-sm shadow-amber-500/30"
          style={{ animationDelay: "3.5s" }}
        ></div>
        <div
          className="absolute top-3/4 left-3/4 h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-blue-500/40 animate-pulse shadow-sm shadow-blue-500/30"
          style={{ animationDelay: "4s" }}
        ></div>
        {/*==================== End of Third row ====================*/}
      </div>
      {/*==================== End of Glowing Dots At Intersections ====================*/}

      <div className="container relative z-20 mx-auto px-4">
        {/*==================== Section Title ====================*/}
        <motion.div
          initial={{ opacity: 0, y: 70 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Upcoming <span className="text-blue-700">Events</span>
          </h2>
          <div className="mx-auto h-1 w-24 bg-gradient-to-r from-blue-700 via-amber-500 to-blue-700 rounded-full mb-6"></div>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Stay updated with our latest workshops, conferences, and activities
            designed to enhance your skills and knowledge.
          </p>
        </motion.div>
        {/*==================== End of Section Title ====================*/}

        {/*==================== Filter Buttons ====================*/}
        <motion.div
          initial={{ opacity: 0, y: 70 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 flex flex-wrap justify-center gap-4"
        >
          <button
            onClick={() => setActiveFilter("all")}
            className={`group relative overflow-hidden rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300 ${
              activeFilter === "all"
                ? "bg-blue-700 text-white shadow-md shadow-blue-700/30"
                : "bg-white/70 backdrop-blur-sm text-gray-700 border border-gray-200 hover:border-blue-700/50"
            }`}
          >
            <span className="relative z-10">All Events</span>
            {activeFilter !== "all" && (
              <span className="absolute inset-0 -z-10 translate-y-full bg-blue-700 transition-transform duration-300 group-hover:translate-y-0"></span>
            )}
          </button>

          <button
            onClick={() => setActiveFilter("workshop")}
            className={`group relative overflow-hidden rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300 ${
              activeFilter === "workshop"
                ? "bg-blue-700 text-white shadow-md shadow-blue-700/30"
                : "bg-white/70 backdrop-blur-sm text-gray-700 border border-gray-200 hover:border-blue-700/50"
            }`}
          >
            <span className="relative z-10">Workshops</span>
            {activeFilter !== "workshop" && (
              <span className="absolute inset-0 -z-10 translate-y-full bg-blue-700 transition-transform duration-300 group-hover:translate-y-0"></span>
            )}
          </button>

          <button
            onClick={() => setActiveFilter("conference")}
            className={`group relative overflow-hidden rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300 ${
              activeFilter === "conference"
                ? "bg-blue-700 text-white shadow-md shadow-blue-700/30"
                : "bg-white/70 backdrop-blur-sm text-gray-700 border border-gray-200 hover:border-blue-700/50"
            }`}
          >
            <span className="relative z-10">Conferences</span>
            {activeFilter !== "conference" && (
              <span className="absolute inset-0 -z-10 translate-y-full bg-blue-700 transition-transform duration-300 group-hover:translate-y-0"></span>
            )}
          </button>

          <button
            onClick={() => setActiveFilter("hackathon")}
            className={`group relative overflow-hidden rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300 ${
              activeFilter === "hackathon"
                ? "bg-blue-700 text-white shadow-md shadow-blue-700/30"
                : "bg-white/70 backdrop-blur-sm text-gray-700 border border-gray-200 hover:border-blue-700/50"
            }`}
          >
            <span className="relative z-10">Hackathons</span>
            {activeFilter !== "hackathon" && (
              <span className="absolute inset-0 -z-10 translate-y-full bg-blue-700 transition-transform duration-300 group-hover:translate-y-0"></span>
            )}
          </button>

          <button
            onClick={() => setActiveFilter("seminar")}
            className={`group relative overflow-hidden rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300 ${
              activeFilter === "seminar"
                ? "bg-blue-700 text-white shadow-md shadow-blue-700/30"
                : "bg-white/70 backdrop-blur-sm text-gray-700 border border-gray-200 hover:border-blue-700/50"
            }`}
          >
            <span className="relative z-10">Seminars</span>
            {activeFilter !== "seminar" && (
              <span className="absolute inset-0 -z-10 translate-y-full bg-blue-700 transition-transform duration-300 group-hover:translate-y-0"></span>
            )}
          </button>
        </motion.div>
        {/*==================== End of Filter Buttons ====================*/}

        {/*==================== Event Cards ====================*/}
        <div className="grid gap-8 md:grid-cols-2">
          <AnimatePresence>
            {animateCards &&
              filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:border-blue-700/30 hover:shadow-lg hover:shadow-blue-700/5"
                >
                  <div className="flex flex-col h-full">
                    <div className="relative h-56 w-full overflow-hidden">
                      <Image
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                      {/*==================== Category Badge ====================*/}
                      <div
                        className={`absolute top-4 right-4 rounded-full px-3 py-1 text-xs font-semibold uppercase text-white backdrop-blur-sm ${
                          event.category === "workshop"
                            ? "bg-blue-700/80"
                            : event.category === "conference"
                              ? "bg-amber-500/80"
                              : event.category === "hackathon"
                                ? "bg-green-500/80"
                                : "bg-purple-500/80"
                        }`}
                      >
                        {event.category}
                      </div>

                      {/*==================== Save/Bookmark Button ====================*/}
                      <button className="absolute top-4 left-4 h-8 w-8 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white/90 hover:text-white transition-colors">
                        <Bookmark className="h-4 w-4" />
                      </button>
                      {/*==================== End of Save/Bookmark Button ====================*/}
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-6">
                      <div>
                        <h3 className="mb-3 text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                          {event.title}
                        </h3>
                        <p className="mb-5 text-gray-600">
                          {event.description}
                        </p>

                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="mr-3 h-4 w-4 text-amber-500" />
                            {event.date}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="mr-3 h-4 w-4 text-amber-500" />
                            {event.time}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="mr-3 h-4 w-4 text-amber-500" />
                            {event.location}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <button className="group/btn relative overflow-hidden rounded-full border border-blue-700/50 bg-transparent px-5 py-2 text-sm text-blue-700 transition-all hover:bg-blue-700 hover:text-white hover:border-blue-700 flex items-center">
                          <span>Learn more</span>
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                        </button>
                      </div>
                    </div>

                    {/*==================== Decorative Corner Glow ====================*/}
                    <div className="absolute -bottom-2 -right-2 h-16 w-16 rounded-full bg-blue-700/5 blur-xl group-hover:bg-blue-700/10 transition-colors duration-300"></div>
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
        {/*==================== End of Event Cards ====================*/}

        {/*==================== View All Button ====================*/}
        <motion.div
          initial={{ opacity: 0, y: 70 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <button className="group relative overflow-hidden rounded-full bg-blue-700 px-8 py-3 font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-700/30">
            <span className="relative z-10 flex items-center justify-center">
              View All Events
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
            <span className="absolute inset-0 -z-10 translate-y-full bg-amber-500 transition-transform duration-300 group-hover:translate-y-0"></span>
          </button>
        </motion.div>
        {/*==================== End of View All Button ====================*/}
      </div>
    </section>
  );
};

export default EventsSection;
