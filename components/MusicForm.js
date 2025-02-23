'use client'
import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoClose } from 'react-icons/io5'
import { IoMdMusicalNote } from 'react-icons/io'
import { FiSave, FiUpload } from 'react-icons/fi'

const MusicForm = ({ isOpen, onClose, onSave }) => {
  const [musicName, setMusicName] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('audio/')) {
      setSelectedFile(file)
      if (!musicName) {
        // Set music name from file name without extension
        setMusicName(file.name.replace(/\.[^/.]+$/, ""))
      }
    } else {
      alert('Please select an audio file')
      e.target.value = null
    }
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)
      const formData = new FormData()
      formData.append('name', musicName)
      formData.append('file', selectedFile)

      const response = await fetch('/api/saveMusic', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        alert('Music saved successfully!')
        setMusicName('')
        setSelectedFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        onSave?.() // Call the callback after successful save
        onClose()
      }
    } catch (error) {
      alert('Failed to save music: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-white p-6 rounded-lg w-96"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <IoMdMusicalNote className="text-blue-500" />
                Add New Music
              </h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <IoClose size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block mb-1">Music Name:</label>
                <input
                  type="text"
                  value={musicName}
                  onChange={(e) => setMusicName(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter music name"
                />
              </div>
              <div>
                <label className="block mb-1">Music File:</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="audio/*"
                  className="w-full p-2 border rounded"
                />
              </div>
              {selectedFile && (
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">
                    Selected file: {selectedFile.name}
                  </p>
                </div>
              )}
              <motion.button
                onClick={handleSave}
                disabled={isLoading || !musicName || !selectedFile}
                className={`w-full ${
                  isLoading || !musicName || !selectedFile 
                    ? 'bg-gray-500' 
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white p-2 rounded flex items-center justify-center gap-2`}
                whileHover={{ scale: (!isLoading && musicName && selectedFile) ? 1.02 : 1 }}
                whileTap={{ scale: (!isLoading && musicName && selectedFile) ? 0.98 : 1 }}
              >
                {isLoading ? <FiUpload className="animate-spin" /> : <FiSave />}
                {isLoading ? 'Uploading...' : 'Save Music'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default MusicForm
