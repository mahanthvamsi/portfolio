"use client";

import { useEffect } from "react";
import Approach from "@/components/Approach";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import RecentProjects from "@/components/RecentProjects";
import { TimelineDemo } from "@/components/TimelineDemo";
import { FloatingNav } from "@/components/ui/FloatingNav";
import { navItems, workExperience } from "@/data";
import About from "@/components/about";
import ExperienceRack from "@/components/experience-rack/ExperienceRack";

export default function Home() {
  // Handle refresh: scroll to top and navigate to home
  useEffect(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigation && navigation.type === 'reload') {
      window.scrollTo({ top: 0, behavior: 'instant' });
      
      if (window.location.hash || (window.location.pathname !== '/' && window.location.pathname !== '')) {
        window.history.replaceState(null, '', '/');
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    }
  }, []);

  // Handle Scroll tracking to update URL hashes
  useEffect(() => {
    // Select all sections that have an ID
    const sections = document.querySelectorAll("section[id]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // If the section crosses the middle of the screen
          if (entry.isIntersecting) {
            // Update the URL hash without jumping
            window.history.replaceState(null, "", `#${entry.target.id}`);
          }
        });
      },
      {
        // This root margin means it triggers when the section hits the middle 50% of the screen
        rootMargin: "-40% 0px -40% 0px", 
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect(); // Cleanup on unmount
  }, []);

  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col mx-auto sm:px-10 px-5 overflow-clip">
      <div className="max-w-7xl w-full">
        <FloatingNav navItems={navItems} />
        
        {/* Wrap your components in sections with IDs so the observer can track them */}
        <section id="" className="w-full">
          <Hero />
        </section>

        <section id="about" className="w-full">
          <About />
        </section>

        <section id="timeline" className="w-full">
          <TimelineDemo />
        </section>
        
        <section id="projects" className="w-full">
          <RecentProjects />
        </section>
        
        <section id="experience" className="w-full">
          <ExperienceRack />
        </section>

        <section id="approach" className="w-full">
          <Approach />
        </section>

        <section id="contact" className="w-full">
          <Footer />
        </section>
      </div>
    </main>
  );
}