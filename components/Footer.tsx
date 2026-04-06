import React from 'react'
import MagicButton from './ui/MagicButton'
import { FaGithub, FaLinkedin, FaLocationArrow } from 'react-icons/fa6'
import { socialMedia } from '@/data'


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

const Footer = () => {
  return (
    <footer className='w-full pb-24 md:pb-16' id="contact">

      <div className='flex flex-col items-center'>
        <h1 className='heading lg:max-w-[45vw]'>
          Ready to take <span className='text-purple'>your</span> digital presence to the next level?
        </h1>

        <p className='text-white-200 md:mt-10 my-5 text-center'>
          Reach out to me anytime
        </p>
        <a href="mailto:mahanthvamsis1@gmail.com">
          <MagicButton
            title="Let's Get in Touch"
            icon={<FaLocationArrow />}
            position='right'
          />
        </a>
      </div>

      <div className='flex flex-col items-center gap-4 mt-16'>
        <p className='md:text-base text-sm md:font-normal font-light text-center'>
          Copyright © 2025 Vamsi
        </p>

        <div className='flex items-center gap-4'>
          {socials.map((profile) => (
            <a
              key={profile.id}
              href={profile.href}
              target="_blank"
              rel="noopener noreferrer"
              className='w-10 h-10 cursor-pointer flex justify-center items-center backdrop-filter backdrop-blur-lg saturate-180 bg-opacity-75 bg-black-200 rounded-lg border border-black-300 hover:border-purple/50 transition-all duration-300'
            >
              {profile.icon}
            </a>
          ))}
        </div>
      </div>

    </footer>
  )
}

export default Footer