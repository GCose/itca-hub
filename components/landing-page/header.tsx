import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Set up intersection observer for each section
    const sections = document.querySelectorAll("section[id]");
    const observerOptions = {
      root: null,
      rootMargin: "-100px 0px -100px 0px",
      threshold: 0.3,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );
    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Helper function to determine if a link is active
  const isActive = (sectionId: string) => {
    return activeSection === sectionId ? "link-active" : "";
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
                href="#hero-section"
                className={`font-medium transition-colors ${
                  isScrolled
                    ? "text-gray-900 hover:text-blue-700"
                    : "text-white hover:text-amber-500"
                } ${isActive("hero-section")}`}
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
                } ${isActive("events")}`}
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
                } ${isActive("degrees")}`}
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
                } ${isActive("virtual-tour")}`}
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
                } ${isActive("resources")}`}
              >
                Resources
              </a>
            </li>
          </ul>
        </nav>

        <div className="hidden md:flex gap-2">
          <Link
            href={"/auth"}
            className={`rounded-full px-6 py-2 font-medium transition-all ${
              isScrolled
                ? "text-gray-800 hover:bg-blue-600 hover:text-white"
                : "text-white hover:bg-white/20"
            }`}
          >
            Sign in
          </Link>
          <Link
            href={"/auth/sign-up"}
            className={`rounded-full px-6 py-2 font-medium transition-all ${
              isScrolled
                ? "bg-blue-700 text-white hover:bg-blue-600"
                : "bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
            }`}
          >
            Sign Up
          </Link>
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
                  href="#hero-section"
                  className={`block font-medium text-gray-900 hover:text-blue-700 ${isActive(
                    "hero-section"
                  )}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#events"
                  className={`block font-medium text-gray-900 hover:text-blue-700 ${isActive(
                    "events"
                  )}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Events
                </a>
              </li>
              <li>
                <a
                  href="#degrees"
                  className={`block font-medium text-gray-900 hover:text-blue-700 ${isActive(
                    "degrees"
                  )}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Degrees
                </a>
              </li>
              <li>
                <a
                  href="#virtual-tour"
                  className={`block font-medium text-gray-900 hover:text-blue-700 ${isActive(
                    "virtual-tour"
                  )}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Virtual Tour
                </a>
              </li>
              <li>
                <a
                  href="#resources"
                  className={`block font-medium text-gray-900 hover:text-blue-700 ${isActive(
                    "resources"
                  )}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Resources
                </a>
              </li>
              <li className="pt-4 space-y-2">
                <Link
                  href="/auth"
                  className="block w-full rounded-full px-6 py-2 font-medium text-gray-800 transition-all hover:bg-blue-600 hover:text-white text-center"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="block w-full rounded-full bg-blue-700 px-6 py-2 font-medium text-white transition-all hover:bg-blue-600 text-center"
                >
                  Sign up
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
