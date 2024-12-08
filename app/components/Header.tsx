'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Menu, X, ChevronUp } from 'lucide-react'
import Logo from './Logo'
import { smoothScroll } from '../utils/smoothScroll'

const navItems = [
  { name: 'Home', href: '/#home' },
  { name: 'About', href: '/#about' },
  { name: 'Products', href: '/#products' },
  { name: 'Gallery', href: '/#gallery' },
  { name: 'Legalitas', href: '/#legal' },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
      setShowScrollTop(window.scrollY > 300)

      // Determine active section
      const scrollPosition = window.scrollY + 100 // Add offset for header height

      if (scrollPosition < 100) { // Adjust this value based on your layout
        setActiveSection('home')
      } else {
        const sections = navItems.map(item => item.href.replace('/#', ''))
        for (const section of sections.reverse()) {
          const element = document.getElementById(section)
          if (element && scrollPosition >= element.offsetTop) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    e.preventDefault()
    if (href === '/#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (href.startsWith('/#')) {
      const targetId = href.replace('/#', '')
      smoothScroll(e, targetId)
    }
    setIsMenuOpen(false)
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <>
      <header className={`fixed w-full z-50 transition-all duration-300 backdrop-blur-sm ${
        isScrolled 
          ? 'bg-white/90 shadow-lg dark:bg-gray-800/90 dark:shadow-gray-900/30' 
          : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center">
              <Link href="/#home" className="flex-shrink-0 hover:opacity-80 transition-opacity" onClick={(e) => handleNavClick(e, '/#home')}>
                <Logo />
              </Link>
            </div>
            <nav className="hidden md:block">
              <ul className="flex space-x-6">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`relative px-3 py-2 text-sm font-medium transition-all duration-200
                        ${activeSection === item.href.replace('/#', '')
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-gray-600 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400'
                        }
                        after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-center
                        after:scale-x-0 after:bg-green-600 after:transition-transform after:duration-200
                        hover:after:scale-x-100
                      `}
                      onClick={(e) => handleNavClick(e, item.href)}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/login"
                className="hidden sm:inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-full text-white bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transform transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              >
                Admin Login
              </Link>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 transition-all duration-200 md:hidden"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu with improved animation */}
        <motion.div
          className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: isMenuOpen ? 1 : 0, height: isMenuOpen ? 'auto' : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="px-2 pt-2 pb-3 space-y-2 sm:px-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200
                  ${activeSection === item.href.replace('/#', '')
                    ? 'bg-green-50 text-green-600 dark:bg-gray-700 dark:text-green-400'
                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                onClick={(e) => handleNavClick(e, item.href)}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/admin/login"
              className="block w-full text-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Admin Login
            </Link>
          </div>
        </motion.div>
      </header>

      {/* Enhanced scroll to top button */}
      <motion.button
        className="fixed bottom-6 right-6 p-3 rounded-full bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg hover:shadow-xl z-50 transform hover:-translate-y-1 transition-all duration-200"
        onClick={scrollToTop}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ 
          opacity: showScrollTop ? 1 : 0,
          scale: showScrollTop ? 1 : 0.5,
        }}
        transition={{ duration: 0.3 }}
      >
        <ChevronUp className="h-6 w-6" />
      </motion.button>
    </>
  )
}

