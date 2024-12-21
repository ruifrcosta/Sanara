import React from 'react';
import Link from 'next/link';
import { ChevronDownIcon } from './icons';

const Navbar = () => {
  return (
    <nav className="flex flex-row justify-between items-center px-[156px] w-full h-[84px] bg-[#F1F4F9]">
      <div className="flex flex-row items-center px-4 gap-6 w-[147.95px] h-[36.67px]">
        <div className="relative">
          <div className="w-[23.95px] h-[26px] bg-[#006397]" />
          <div className="absolute h-[24.48px] left-[17.08px] right-[107.42px] top-[-0.92px] bg-[#006397] transform matrix-[0.81,0.59,-0.59,0.81,0,0]" />
          <div className="absolute h-[6.5px] left-[12.4px] right-[131.18px] top-[21.94px] bg-[#006397] transform matrix-[0.81,0.58,-0.58,0.81,0,0]" />
        </div>
        <span className="font-archivo font-bold text-2xl leading-[51px] text-[#006397]">Sanara</span>
      </div>

      <div className="flex flex-row items-center p-4 w-[486px] h-[52px] bg-[#EBEEF3] rounded-[40px]">
        <div className="flex flex-row items-center w-[478px] h-[44px]">
          <Link href="#" className="flex justify-center items-center px-4 py-3 text-sm font-medium text-[#42474E]">
            Help
          </Link>
          <Link href="#" className="flex justify-center items-center px-4 py-3 gap-1.5 text-sm font-medium text-[#42474E]">
            About
            <ChevronDownIcon className="w-4 h-4" />
          </Link>
          <Link href="#" className="flex justify-center items-center px-4 py-3 text-sm font-medium text-[#42474E]">
            Contact Us
          </Link>
          <Link href="#" className="flex justify-center items-center px-4 py-3 gap-1.5 text-sm font-medium text-[#42474E]">
            Pricing
            <ChevronDownIcon className="w-4 h-4" />
          </Link>
          <Link href="#" className="flex justify-center items-center px-4 py-3 text-sm font-medium text-[#42474E]">
            Log In
          </Link>
        </div>
      </div>

      <div className="flex flex-row justify-end items-start gap-2 w-[294px] h-[40px]">
        <button className="flex justify-center items-center px-4 py-2.5 w-[50px] h-[40px] border border-[#006397] rounded-full">
          <div className="w-[18px] h-[18px] border-[1.5px] border-[#006397]" />
        </button>
        <button className="flex justify-center items-center px-4 py-2.5 w-[137px] h-[40px] border border-[#006397] rounded-full">
          <span className="text-sm font-semibold text-[#006397]">Sign In</span>
        </button>
        <button className="flex justify-center items-center px-4 py-2.5 w-[91px] h-[40px] bg-[#006397] rounded-full">
          <span className="text-sm font-semibold text-white">Get Started</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 