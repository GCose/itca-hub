import Head from "next/head";
import { useEffect } from "react";
import Header from "../components/landing-page/header";
import HeroSection from "../components/landing-page/hero-section";
import EventsSection from "../components/landing-page/events-section";
import DegreesSection from "../components/landing-page/degrees-section";
// import QuickLinks from "../components/landing-page/quick-links";
import VirtualTour from "../components/landing-page/virtual-tour";
import ResourcesSection from "../components/landing-page/resources-section";
import Footer from "../components/landing-page/footer";
import Link from "next/link";

const HomePage = () => {
  // Smooth scroll implementation for navigation
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');

      if (anchor) {
        e.preventDefault();
        const targetId = anchor.getAttribute("href");

        if (targetId && targetId !== "#") {
          const targetElement = document.querySelector(targetId);

          if (targetElement) {
            window.scrollTo({
              top:
                targetElement.getBoundingClientRect().top +
                window.scrollY -
                100,
              behavior: "smooth",
            });
          }
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);

  return (
    <>
      <Head>
        <title>ITCA - Information Technology Communication Association</title>
        <meta
          name="description"
          content="Information Technology Communication Association under the School of Information Communication and Technology"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Link rel="icon" href="/favicon.ico" />
        <Link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          crossOrigin="anonymous"
          href="https://fonts.gstatic.com"
        />
        <Link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
        />
      </Head>
      <Header />

      <main className="min-h-screen font-['Inter',sans-serif]">
        <HeroSection />
        {/* <QuickLinks /> */}
        <EventsSection />
        <DegreesSection />
        <VirtualTour />
        <ResourcesSection />
        <Footer />
      </main>
    </>
  );
};

export default HomePage;
