import React from 'react';
import Link from 'next/link';
import { FacebookIcon, TwitterIcon, InstagramIcon, LinkedInIcon } from './icons';

const Footer = () => {
  const socialLinks = [
    { icon: FacebookIcon, href: '#', label: 'Facebook' },
    { icon: TwitterIcon, href: '#', label: 'Twitter' },
    { icon: InstagramIcon, href: '#', label: 'Instagram' },
    { icon: LinkedInIcon, href: '#', label: 'LinkedIn' }
  ];

  const footerLinks = [
    {
      title: 'Product',
      links: ['Overview', 'Features', 'Solutions', 'Tutorials', 'Pricing']
    },
    {
      title: 'Company',
      links: ['About us', 'Careers', 'Press', 'News', 'Contact']
    },
    {
      title: 'Resources',
      links: ['Blog', 'Newsletter', 'Events', 'Help center', 'Tutorials']
    },
    {
      title: 'Legal',
      links: ['Terms', 'Privacy', 'Cookies', 'Licenses', 'Contact']
    }
  ];

  return (
    <footer className="bg-[#F1F4F9] pt-20 pb-8">
      <div className="mx-auto px-[156px]">
        <div className="grid grid-cols-5 gap-8 pb-12 border-b border-[#E6E8EC]">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 bg-[#006397]" />
              <span className="text-xl font-bold text-[#006397]">Sanara</span>
            </div>
            <p className="text-[#6F767E] mb-6">
              Design amazing digital experiences that create more happy in the world.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white hover:bg-[#006397]/10 transition-colors"
                >
                  <social.icon className="w-5 h-5 text-[#006397]" />
                </Link>
              ))}
            </div>
          </div>

          {footerLinks.map((column) => (
            <div key={column.title}>
              <h3 className="font-semibold text-[#1A1D1F] mb-6">{column.title}</h3>
              <ul className="space-y-4">
                {column.links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-[#6F767E] hover:text-[#006397] transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 text-center text-[#6F767E]">
          <p>© 2024 Sanara. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 