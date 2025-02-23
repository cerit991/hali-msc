'use client'
import React, { useState, useEffect } from 'react'
import MusicForm from '@/components/MusicForm'
import MusicList from '@/components/MusicList'
import MusicPlayer from '@/components/MusicPlayer'
import { motion } from 'framer-motion'
import { IoMdAdd } from 'react-icons/io'

const Page = () => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [currentSong, setCurrentSong] = useState(null)
  const [allSongs, setAllSongs] = useState([])

  const refreshMusicList = async () => {
    try {
      const response = await fetch('/api/saveMusic')
      const data = await response.json()
      setAllSongs(data.data || [])
    } catch (error) {
      console.error('Error fetching songs:', error)
    }
  }

  useEffect(() => {
    refreshMusicList()
  }, [])

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <motion.button 
        onClick={() => setIsFormOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <IoMdAdd size={20} />
        Add New Music
      </motion.button>

      <MusicForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)}
        onSave={refreshMusicList}
      />
      
      <MusicList onSelectSong={setCurrentSong} songs={allSongs} />
      <MusicPlayer currentSong={currentSong} allSongs={allSongs} />
    </div>
  )
}

export default Page