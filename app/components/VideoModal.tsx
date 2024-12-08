import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect } from 'react'

interface Video {
  id: number;
  title: string;
  thumbnail_url: string;
  video_url: string;
  views: number;
}

interface VideoModalProps {
  video: Video;
  onClose: () => void;
}

export default function VideoModal({ video, onClose }: VideoModalProps) {
  useEffect(() => {
    // Update view count when video is opened
    const updateViews = async () => {
      try {
        await fetch(`/api/videos/${video.id}/views`, {
          method: 'POST'
        })
      } catch (error) {
        console.error('Failed to update view count:', error)
      }
    }
    updateViews()
  }, [video.id])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-video">
          <video
            src={video.video_url}
            poster={video.thumbnail_url}
            controls
            autoPlay
            playsInline
            className="absolute top-0 left-0 w-full h-full rounded-t-xl"
          />
        </div>
        <div className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                {video.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {video.views.toLocaleString()} views
              </p>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700/50 transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

