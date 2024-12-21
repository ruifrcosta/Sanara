import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Help', href: '#' },
  { name: 'About', href: '#about', hasDropdown: true },
  { name: 'Contact Us', href: '#contact' },
  { name: 'Pricing', href: '#pricing', hasDropdown: true },
  { name: 'Log In', href: '/login' },
]

interface SiteLayoutProps {
  children: React.ReactNode
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="bg-white">
      {/* Navigation Bar */}
      <header className="fixed inset-x-0 top-0 z-50 h-[84px] bg-[#F1F4F9]">
        <nav className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-[156px]" aria-label="Global">
          {/* Logo */}
          <div className="flex h-[36.67px] w-[147.95px] items-center gap-[6px] p-[4px]">
            <div className="relative">
              <div className="h-[26px] w-[23.95px] bg-[#006397]" /> {/* Union */}
              <div 
                className="absolute left-[17.08px] right-[107.42px] top-[-0.92px] h-[24.48px] bg-[#006397]"
                style={{ transform: 'matrix(0.81, 0.59, -0.59, 0.81, 0, 0)' }}
              /> {/* Subtract */}
              <div 
                className="absolute left-[12.4px] right-[131.18px] top-[21.94px] h-[6.5px] bg-[#006397]"
                style={{ transform: 'matrix(0.81, 0.58, -0.58, 0.81, 0, 0)' }}
              /> {/* Ellipse */}
            </div>
            <span className="font-archivo text-2xl font-bold leading-[51px] text-[#006397]">
              Sanara
            </span>
          </div>

          {/* Menu */}
          <div className="flex h-[52px] w-[486px] items-center rounded-[40px] bg-[#EBEEF3] p-[4px]">
            <div className="flex h-[44px] w-[478px] items-center">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex h-[44px] items-center justify-center gap-[6px] px-4 py-3"
                >
                  <span className="font-figtree text-sm font-medium leading-5 tracking-[0.1px] text-[#42474E]">
                    {item.name}
                  </span>
                  {item.hasDropdown && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 6L8 10L12 6" stroke="#42474E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex h-[40px] w-[294px] items-start justify-end gap-2">
            <button className="flex h-[40px] w-[50px] items-center justify-center rounded-full border border-[#006397]">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.25 14.25C11.5637 14.25 14.25 11.5637 14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25Z" stroke="#006397" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15.75 15.75L12.4875 12.4875" stroke="#006397" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="flex h-[40px] w-[137px] items-center justify-center rounded-full border border-[#006397]">
              <span className="font-figtree text-sm font-semibold leading-5 tracking-[0.1px] text-[#006397]">
                Sign In
              </span>
            </button>
            <button className="flex h-[40px] w-[91px] items-center justify-center rounded-full bg-[#006397]">
              <span className="font-figtree text-sm font-semibold leading-5 tracking-[0.1px] text-white">
                Get Started
              </span>
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
          <div className="fixed inset-0 z-50" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm">
            {/* Mobile menu content */}
          </Dialog.Panel>
        </Dialog>
      </header>

      {/* Main Content */}
      <main className="pt-[84px]">{children}</main>
    </div>
  )
} 