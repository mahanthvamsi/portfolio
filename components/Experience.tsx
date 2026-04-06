"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { workExperience } from "@/data";

const Experience = () => {
  // 1. Add mounted state to fix hydration mismatch for random particle positions
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section id="experience" className="py-20 w-full relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(168, 85, 247, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10"
      >
        <h1 className="heading text-center mb-4">
          My <span className="text-purple">Experience</span>
        </h1>
        <p className="text-center text-white-200 text-sm md:text-base max-w-2xl mx-auto mb-16">
          Building real-world solutions and learning from industry experts
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Connection line */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-purple/50 to-transparent transform -translate-x-1/2" />

        <div className="space-y-12 md:space-y-24">
          {workExperience.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`flex flex-col md:flex-row gap-8 items-center ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Timeline Node */}
              <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-purple via-purple/80 to-purple-900 p-[3px] shadow-lg shadow-purple/50">
                <div className="w-full h-full rounded-full bg-black-100 flex items-center justify-center">
                  <motion.img
                    src={exp.thumbnail}
                    alt={exp.company}
                    className="w-8 h-8 object-contain"
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                  />
                </div>
              </div>

              {/* Content Card */}
              <div className={`flex-1 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                <motion.div
                  className="group relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Glowing border effect */}
                  <div className="absolute -inset-[1px] bg-gradient-to-r from-purple via-blue-500 to-purple rounded-2xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500" />
                  
                  {/* Card */}
                  <div className="relative bg-gradient-to-br from-[#0D0D1F] via-[#13132B] to-[#0A0A1E] rounded-2xl p-6 md:p-8 border border-white/[0.1] shadow-xl overflow-hidden">
                    {/* Decorative corner accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple/5 rounded-full blur-3xl" />
                    
                    <div className="relative z-10">
                      {/* Mobile icon */}
                      <div className="md:hidden w-12 h-12 rounded-xl bg-gradient-to-br from-purple/20 to-purple/5 flex items-center justify-center mb-4 border border-purple/20">
                        <img
                          src={exp.thumbnail}
                          alt={exp.company}
                          className="w-6 h-6 object-contain"
                        />
                      </div>

                      {/* Duration badge */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 + 0.4 }}
                        className="inline-block px-4 py-1.5 rounded-full bg-purple/10 border border-purple/20 mb-4"
                      >
                        <span className="text-purple text-xs md:text-sm font-medium">
                          {exp.duration}
                        </span>
                      </motion.div>

                      {/* Role & Company */}
                      <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 + 0.5 }}
                        className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight"
                      >
                        {exp.roleType}
                      </motion.h3>
                      
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 + 0.6 }}
                        className="text-purple-300/80 text-sm md:text-base font-medium mb-6"
                      >
                        {exp.company}
                      </motion.p>

                      {/* Highlights */}
                      <div className="space-y-3">
                        {exp.points.map((point, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.2 + 0.7 + idx * 0.1 }}
                            className="flex items-start gap-3 group/item"
                          >
                            <div className="flex-shrink-0 mt-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-purple group-hover/item:scale-150 transition-transform duration-300" />
                            </div>
                            <p className="text-white-200 text-sm md:text-base leading-relaxed group-hover/item:text-white transition-colors duration-300">
                              {point}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Decorative gradient overlay */}
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple/50 to-transparent" />
                  </div>
                </motion.div>
              </div>

              {/* Spacer for alignment */}
              <div className="hidden md:block flex-1" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Floating particles - Wrapped in isMounted to prevent server/client HTML mismatch */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {isMounted && [...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default Experience;