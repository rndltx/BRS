import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Comment {
  id: number;
  username: string;
  text: string;
  timestamp: string;
}

interface CommentSectionProps {
  comments: Comment[];
  addComment: (text: string) => void;
}

export default function CommentSection({ comments, addComment }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim()) {
      addComment(newComment.trim())
      setNewComment('')
    }
  }

  return (
    <div className="mt-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <h4 className="text-xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
        Comments
      </h4>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-3 pr-24 bg-white/80 dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium text-sm transform hover:-translate-y-[52%] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Post
          </button>
        </div>
      </form>
      <div className="space-y-4 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        <AnimatePresence>
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex space-x-3 p-3 bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm rounded-lg hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-200"
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 font-medium">
                  {comment.username[0].toUpperCase()}
                </div>
              </div>
              <div className="flex-grow">
                <p className="font-semibold text-gray-900 dark:text-white">{comment.username}</p>
                <p className="text-gray-700 dark:text-gray-300 mt-1">{comment.text}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{comment.timestamp}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

