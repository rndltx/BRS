'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import { Download, FileText } from 'lucide-react'
import Header from './components/Header'
import Footer from './components/Footer'
import VisionMission from './components/VisionMission'
import Products from './components/Products'
import Gallery from './components/Gallery'
import VideoDocumentation from './components/VideoDocumentation'
import ImageSlideshow from './components/ImageSlideshow'
import OrganizationalStructure from './components/OrganizationalStructure'
import { useSettings } from './contexts/SettingsContext'
import ThemeSwitcher from './components/ThemeSwitcher'

interface Document {
  title: string;
  pdfUrl: string;
  description: string;
}

const legalDocuments: Document[] = [
  {
    title: "Akta Pendirian",
    pdfUrl: "/documents/akta-pendirian.pdf",
    description: "Dokumen resmi pendirian perusahaan"
  },
  {
    title: "NIB",
    pdfUrl: "/documents/nib.pdf",
    description: "Nomor Induk Berusaha"
  },
  {
    title: "TDP",
    pdfUrl: "/documents/tdp.pdf",
    description: "Tanda Daftar Perusahaan"
  },
  {
    title: "NPWP",
    pdfUrl: "/documents/npwp.pdf",
    description: "NPWP Perusahaan"
  },

]

function LegalDocuments() {
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)

  return (
    <section id="legal" className="py-24 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
            Legalitas Perusahaan
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {legalDocuments.map((doc, index) => (
              <motion.div
                key={doc.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex flex-col items-center text-center">
                  <FileText className="w-12 h-12 mb-4 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    {doc.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {doc.description}
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setSelectedDoc(doc)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      Preview
                    </button>
                    <a
                      href={doc.pdfUrl}
                      download
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-all duration-200 flex items-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* PDF Preview Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-4xl h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold">{selectedDoc.title}</h3>
              <button 
                onClick={() => setSelectedDoc(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ×
              </button>
            </div>
            <iframe
              src={`${selectedDoc.pdfUrl}#toolbar=0`}
              className="w-full h-full"
              title={selectedDoc.title}
            />
          </div>
        </div>
      )}
    </section>
  )
}

export default function Home() {
  const { settings, isLoading } = useSettings()
  const { setTheme } = useTheme()

  useEffect(() => {
    if (settings?.theme) {
      setTheme(settings.theme)
    }
  }, [settings?.theme, setTheme])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <main className="flex-grow pt-16 sm:pt-20">
        <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
          <ImageSlideshow />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 backdrop-blur-sm"></div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 drop-shadow-xl">
              {settings?.site_name || 'CV. Berkat Rahmat Sejahtera'}
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl font-medium text-gray-200 drop-shadow-lg tracking-wide">
              Innovative Solutions for a Sustainable Future
            </p>
          </motion.div>
        </section>

        <section id="about" className="py-24">
          <VisionMission />
        </section>

        <OrganizationalStructure />

        <section id="products" className="py-24">
          <Products />
        </section>

        <section id="gallery" className="py-24">
          <Gallery />
        </section>

        <LegalDocuments />

        <VideoDocumentation />
      </main>
      <Footer />
      <ThemeSwitcher />
    </div>
  )
}

