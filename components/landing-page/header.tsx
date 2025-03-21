"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-white py-2 shadow-md" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <Image
            width={120}
            height={40}
            alt="ITCA Logo"
            src="/images/logo.jpg"
            className="h-10 w-auto"
          />
        </Link>

        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            <li>
              <a
                href="#"
                className={`font-medium transition-colors ${
                  isScrolled
                    ? "text-gray-900 hover:text-blue-700"
                    : "text-white hover:text-amber-500"
                }`}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#events"
                className={`font-medium transition-colors ${
                  isScrolled
                    ? "text-gray-900 hover:text-blue-700"
                    : "text-white hover:text-amber-500"
                }`}
              >
                Events
              </a>
            </li>
            <li>
              <a
                href="#degrees"
                className={`font-medium transition-colors ${
                  isScrolled
                    ? "text-gray-900 hover:text-blue-700"
                    : "text-white hover:text-amber-500"
                }`}
              >
                Degrees
              </a>
            </li>
            <li>
              <a
                href="#virtual-tour"
                className={`font-medium transition-colors ${
                  isScrolled
                    ? "text-gray-900 hover:text-blue-700"
                    : "text-white hover:text-amber-500"
                }`}
              >
                Virtual Tour
              </a>
            </li>
            <li>
              <a
                href="#resources"
                className={`font-medium transition-colors ${
                  isScrolled
                    ? "text-gray-900 hover:text-blue-700"
                    : "text-white hover:text-amber-500"
                }`}
              >
                Resources
              </a>
            </li>
          </ul>
        </nav>

        <div className="hidden md:block">
          <button
            className={`rounded-full px-6 py-2 font-medium transition-all ${
              isScrolled
                ? "bg-blue-700 text-white hover:bg-blue-600"
                : "bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
            }`}
          >
            Login
          </button>
        </div>

        <button
          onClick={toggleMenu}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm md:hidden"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X
              className={`h-6 w-6 ${
                isScrolled ? "text-gray-900" : "text-white"
              }`}
            />
          ) : (
            <Menu
              className={`h-6 w-6 ${
                isScrolled ? "text-gray-900" : "text-white"
              }`}
            />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="absolute left-0 top-full w-full bg-white py-4 shadow-lg md:hidden">
          <nav className="container mx-auto px-4">
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="block font-medium text-gray-900 hover:text-blue-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#events"
                  className="block font-medium text-gray-900 hover:text-blue-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Events
                </a>
              </li>
              <li>
                <a
                  href="#degrees"
                  className="block font-medium text-gray-900 hover:text-blue-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Degrees
                </a>
              </li>
              <li>
                <a
                  href="#virtual-tour"
                  className="block font-medium text-gray-900 hover:text-blue-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Virtual Tour
                </a>
              </li>
              <li>
                <a
                  href="#resources"
                  className="block font-medium text-gray-900 hover:text-blue-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Resources
                </a>
              </li>
              <li className="pt-4">
                <button className="w-full rounded-full bg-blue-700 px-6 py-2 font-medium text-white transition-all hover:bg-blue-600">
                  Login
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
