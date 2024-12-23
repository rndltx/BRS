import { motion } from 'framer-motion'
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'
import { useSettings } from '../contexts/SettingsContext'
import { useEffect } from 'react'

export default function Footer() {
  const { settings, isLoading } = useSettings()

  useEffect(() => {
    console.log('Footer Settings:', settings)
  }, [settings])

  // Early return while loading with a nicer loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-300"></div>
      </div>
    )
  }

  const defaultSettings = {
    siteName: 'CV. Berkat Rahmat Sejahtera',
    contactEmail: 'cvberkatrahmatsejahtera@gmail.com',
    phoneNumber: '+62 877 1599 2209',
    address: 'Jl. Karangsoo Residence, Kel. Loktabat Utara, Kec. Banjarbaru Utara, Kalimantan Selatan, Indonesia'
  }

  // Use nullish coalescing to fall back to default values
  const {
    siteName = defaultSettings.siteName,
    contactEmail = defaultSettings.contactEmail,
    phoneNumber = defaultSettings.phoneNumber,
    address = defaultSettings.address
  } = settings || {}

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
              {siteName} adalah perusahaan yang bergerak di berbagai bidang strategis untuk mendukung kebutuhan masyarakat modern, mulai dari teknologi hingga pengembangan sumber daya manusia. Berdiri dengan semangat inovasi dan pelayanan berkualitas, kami terus berkomitmen untuk memberikan solusi terbaik bagi klien dan mitra kami.
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
                {address}
              </p>
              <p className="hover:text-gray-300 transition-colors duration-200">
                Phone:{' '}
                <a 
                  href={`tel:${phoneNumber.replace(/\s+/g, '')}`}
                  className="hover:underline"
                >
                  {phoneNumber}
                </a>
              </p>
              <p className="hover:text-gray-300 transition-colors duration-200">
                Email:{' '}
                <a 
                  href={`mailto:${contactEmail}`}
                  className="hover:underline"
                >
                  {contactEmail}
                </a>
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
            &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}

