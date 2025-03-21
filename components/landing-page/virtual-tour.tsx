"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Maximize2,
  Camera,
  CuboidIcon as Cube,
} from "lucide-react";

type TourLocation = {
  id: number;
  name: string;
  description: string;
  image: string;
  type: "image" | "video" | "3d";
};

const tourLocations: TourLocation[] = [
  {
    id: 1,
    name: "Main ICT Building",
    description:
      "Our state-of-the-art ICT building houses modern classrooms, labs, and collaborative spaces.",
    image: "/images/main-building.jpeg",
    type: "image",
  },
  {
    id: 2,
    name: "Computer Labs",
    description:
      "Equipped with the latest hardware and software for hands-on learning experiences.",
    image: "/images/main-building.jpeg",
    type: "image",
  },
  {
    id: 3,
    name: "Innovation Hub",
    description:
      "A dedicated space for students to work on projects and collaborate with industry partners.",
    image: "/images/main-building.jpeg",
    type: "video",
  },
  {
    id: 4,
    name: "Networking Lab",
    description:
      "Specialized lab for network configuration, security testing, and infrastructure design.",
    image: "/images/main-building.jpeg",
    type: "3d",
  },
  {
    id: 5,
    name: "Student Lounge",
    description:
      "Relaxation and social space for students to unwind and connect between classes.",
    image: "/images/main-building.jpeg",
    type: "image",
  },
];

const VirtualTour = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLocation = tourLocations[currentIndex];

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % tourLocations.length);
  };

  const goToPrevious = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + tourLocations.length) % tourLocations.length
    );
  };

  const goToLocation = (index: number) => {
    setCurrentIndex(index);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <section id="virtual-tour" className="relative py-20">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-gray-50 to-white"></div>
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-blue-700/5"></div>
        <div className="absolute -left-20 top-60 h-60 w-60 rounded-full bg-amber-500/5"></div>
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
            Virtual <span className="text-blue-700">Tour</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Explore our facilities and get a feel for the ITCA environment
            without leaving your home.
          </p>
        </motion.div>

        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative mb-8 overflow-hidden rounded-xl bg-black shadow-xl"
        >
          <div className="relative aspect-video w-full">
            <Image
              src={currentLocation.image || "/placeholder.svg"}
              alt={currentLocation.name}
              fill
              className="object-cover"
            />

            {currentLocation.type === "video" && (
              <button
                className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-blue-700/80 text-white transition-transform hover:scale-110"
                aria-label="Play video"
              >
                <Play className="h-8 w-8" />
              </button>
            )}

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="mb-1 flex items-center">
                    {currentLocation.type === "image" && (
                      <Camera className="mr-2 h-4 w-4 text-amber-500" />
                    )}
                    {currentLocation.type === "video" && (
                      <Play className="mr-2 h-4 w-4 text-amber-500" />
                    )}
                    {currentLocation.type === "3d" && (
                      <Cube className="mr-2 h-4 w-4 text-amber-500" />
                    )}
                    <span className="text-sm font-medium uppercase tracking-wider text-amber-500">
                      {currentLocation.type === "image"
                        ? "Photo"
                        : currentLocation.type === "video"
                        ? "Video"
                        : "3D Model"}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold">{currentLocation.name}</h3>
                  <p className="mt-1 text-sm text-gray-300">
                    {currentLocation.description}
                  </p>
                </div>

                <button
                  onClick={toggleFullscreen}
                  className="rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                  aria-label="Toggle fullscreen"
                >
                  <Maximize2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
              aria-label="Previous location"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
              aria-label="Next location"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {tourLocations.map((location, index) => (
            <button
              key={location.id}
              onClick={() => goToLocation(index)}
              className={`relative h-16 w-24 overflow-hidden rounded-md transition-all ${
                currentIndex === index
                  ? "ring-2 ring-blue-700 ring-offset-2"
                  : "opacity-70 hover:opacity-100"
              }`}
              aria-label={`View ${location.name}`}
            >
              <Image
                src={location.image || "/placeholder.svg"}
                alt={location.name}
                fill
                className="object-cover"
              />
              {location.type !== "image" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  {location.type === "video" && (
                    <Play className="h-4 w-4 text-white" />
                  )}
                  {location.type === "3d" && (
                    <Cube className="h-4 w-4 text-white" />
                  )}
                </div>
              )}
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default VirtualTour;
