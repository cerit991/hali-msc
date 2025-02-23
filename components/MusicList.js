'use client'
import { motion } from 'framer-motion'
import { IoMdMusicalNote, IoMdPlay } from 'react-icons/io'
import { FaYoutube } from 'react-icons/fa'

const MusicList = ({ onSelectSong, songs = [] }) => {
  return (
    <div className="mt-8 mb-32">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <IoMdMusicalNote className="text-blue-500" />
        Music Library
      </h2>
      <div className="grid gap-4">
        {songs.map((song) => (
          <motion.div
            key={song.id}
            className="bg-white p-4 rounded-lg shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-medium">{song.name}</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onSelectSong(song)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  <IoMdPlay size={24} />
                </button>
                <a
                  href={song.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 hover:text-red-700"
                >
                  <FaYoutube size={24} />
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default MusicList
