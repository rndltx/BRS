import { motion } from 'framer-motion'
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'
import { useSettings } from '../contexts/SettingsContext'

export default function Footer() {
  const { settings } = useSettings()

  return (
    <footer className="bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-900 dark:to-black text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12">
          {/* About Us section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              About Us
            </h3>
            <p className="text-gray-400 leading-relaxed hover:text-gray-300 transition-colors duration-200">
              {settings?.siteName || 'CV. BRS'} is a leading provider of innovative solutions for businesses across Indonesia.
            </p>
          </motion.div>
          
          {/* Quick Links section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {['Vision & Mission', 'Products', 'Gallery', 'Admin Login'].map((link, index) => (
                <li key={index}>
                  <a 
                    href={`/#${link.toLowerCase().replace(' & ', '-').replace(' ', '')}`}
                    className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center space-x-2"
                  >
                    <span className="hover:translate-x-1 transition-transform duration-200">{link}</span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Us section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Contact Us
            </h3>
            <div className="space-y-3 text-gray-400">
              <p className="hover:text-gray-300 transition-colors duration-200">
                {settings?.address || 'Loading...'}
              </p>
              <p className="hover:text-gray-300 transition-colors duration-200">
                Phone: {settings?.phoneNumber || 'Loading...'}
              </p>
              <p className="hover:text-gray-300 transition-colors duration-200">
                Email: {settings?.contactEmail || 'Loading...'}
              </p>
            </div>
          </motion.div>

          {/* Social Media section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Follow Us
            </h3>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                <a 
                  key={index}
                  href="#" 
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12 pt-8 border-t border-gray-700/50 text-center"
        >
          <p className="text-gray-400 hover:text-gray-300 transition-colors duration-200">
            &copy; {new Date().getFullYear()} {settings?.siteName || 'CV. BRS'}. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}

