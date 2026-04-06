"use client";

import { useState, useEffect } from 'react';
import { Spotlight } from './ui/Spotlight';
import MagicButton from './ui/MagicButton';
import { MdDownload } from "react-icons/md";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';

const socials = [
  {
    label: "GitHub",
    id: "github",
    href: "https://github.com/mahanthvamsi",
    icon: <FaGithub className="text-base" />,
  },
  {
    label: "LinkedIn",
    id: "linkedin",
    href: "https://www.linkedin.com/in/mahanthvamsi/",
    icon: <FaLinkedin className="text-base" />,
  },
];

const Hero = () => {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Intro overlay - fades out while name stays via layoutId */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            className="fixed inset-0 z-[9999] pointer-events-none"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Background */}
            <div className="absolute inset-0 bg-black-100">
              <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
              <div className="absolute pointer-events-none inset-0 bg-black-100 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"/>
            </div>
            {/* Spotlights */}
            <div className="absolute inset-0 pointer-events-none">
              <Spotlight className='absolute -top-40 -left-10 md:-left-32 md:-top-20 h-screen w-screen' fill='white'/>
              <Spotlight className='absolute top-0 left-1/2 h-screen w-screen' fill='purple'/>
              <Spotlight className='absolute top-0 right-0 h-screen w-screen' fill='blue'/>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Hero Section */}
      <div className='pb-20 pt-36 relative min-h-screen flex items-center'>
        {/* Fullscreen Spotlights */}
        <div className="absolute inset-0 pointer-events-none">
          <Spotlight className='absolute -top-40 -left-10 md:-left-32 md:-top-20 h-screen w-screen' fill='white'/>
          <Spotlight className='absolute top-0 left-1/2 h-screen w-screen' fill='purple'/>
          <Spotlight className='absolute top-0 right-0 h-screen w-screen' fill='blue'/>
        </div>

        {/* Animated Grid Background */}
        <div className="absolute inset-0 bg-black-100">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
          <div className="absolute pointer-events-none inset-0 bg-black-100 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"/>
        </div>

        {/* Content */}
        <div className='w-full flex justify-center relative z-10'>
          <div className='max-w-[89vw] md:max-w-3xl lg:max-w-6xl flex flex-col items-center justify-center px-4'>

            {/* Name */}
            <motion.h1
              layoutId="hero-name"
              className='text-4xl md:text-8xl lg:text-9xl font-black mb-6 text-center'
              style={{
                fontFamily: "'Impact', 'Arial Black', sans-serif",
                color: 'white',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Mahanth Vamsi
            </motion.h1>

            {/* Subtitle */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: showIntro ? 0 : 1, y: showIntro ? 10 : 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className='text-1xl md:text-3xl lg:text-4xl font-light mb-4 text-center'
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: '800',
                textTransform: 'uppercase',
              }}
            >
              CS GRADUATE STUDENT
            </motion.h2>

            {/* Professional Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: showIntro ? 0 : 1, y: showIntro ? 10 : 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className='text-center text-white/80 text-base md:text-lg lg:text-xl max-w-3xl leading-relaxed font-light mb-12'
            >
              M.Sc. Computer Science at{' '}
              <span className='text-purple font-medium'>University College Dublin</span>  previously shipped production UI at{' '}
              <span className='text-purple font-medium'>CFT Ventures</span>, built full-stack systems at{' '}
              <span className='text-purple font-medium'>BHEL</span>, and published{' '}
              <span className='text-purple font-medium'>ML research</span> at IEEE.
            </motion.p>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: showIntro ? 0 : 1, y: showIntro ? 10 : 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className='flex items-center justify-center gap-4 mb-12'
            >
              {socials.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: showIntro ? 0 : 1, scale: showIntro ? 0.8 : 1 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  className='flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm font-light hover:bg-white/10 hover:border-purple/50 hover:text-white transition-all duration-300'
                >
                  {social.icon}
                  {social.label}
                </motion.a>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: showIntro ? 0 : 1, scale: showIntro ? 0.9 : 1 }}
              transition={{ duration: 0.5, delay: 0.85 }}
            >
              <a href="/Mahanth_Vamsi_Katragunta.pdf" download>
                <MagicButton
                  title='Download Resume'
                  icon={<MdDownload />}
                  position='right'
                />
              </a>
            </motion.div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;