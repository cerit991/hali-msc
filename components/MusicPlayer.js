'use client'
import { useState, useEffect, useRef } from 'react'
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player'
import 'react-h5-audio-player/lib/styles.css'
import { motion } from 'framer-motion'
import { IoMdMusicalNote, IoMdSkipBackward, IoMdSkipForward } from 'react-icons/io'
import { TbRepeatOnce, TbRepeat } from 'react-icons/tb'
import { formatTime } from '@/utils/formatTime'

const MusicPlayer = ({ currentSong, allSongs }) => {
  const [playlist, setPlaylist] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [repeatMode, setRepeatMode] = useState('none') // none, all, one
  const playerRef = useRef(null)

  useEffect(() => {
    if (allSongs?.length) {
      setPlaylist(allSongs)
    }
  }, [allSongs])

  useEffect(() => {
    if (currentSong) {
      const newIndex = playlist.findIndex(song => song.id === currentSong.id)
      if (newIndex !== -1) setCurrentIndex(newIndex)
    }
  }, [currentSong, playlist])

  // MediaSession API için yeni useEffect
  useEffect(() => {
    if ('mediaSession' in navigator && playlist[currentIndex]) {
      const currentTrack = playlist[currentIndex]
      
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.name,
        artist: 'Music Player',
        album: 'My Playlist',
        artwork: [
          {
            src: '/icons/music-icon-96.png',
            sizes: '96x96',
            type: 'image/png'
          },
          {
            src: '/icons/music-icon-128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: '/icons/music-icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/music-icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
        ]
      })

      // Medya kontrolleri için event handlers
      navigator.mediaSession.setActionHandler('play', () => {
        playerRef.current?.audio.current.play()
      })
      
      navigator.mediaSession.setActionHandler('pause', () => {
        playerRef.current?.audio.current.pause()
      })
      
      navigator.mediaSession.setActionHandler('previoustrack', handleClickPrevious)
      navigator.mediaSession.setActionHandler('nexttrack', handleClickNext)
    }
  }, [currentIndex, playlist])

  const handleClickNext = () => {
    if (currentIndex < playlist.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else if (repeatMode === 'all') {
      setCurrentIndex(0)
    }
  }

  const handleClickPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
    } else if (repeatMode === 'all') {
      setCurrentIndex(playlist.length - 1)
    }
  }

  const handleEnded = () => {
    if (repeatMode === 'one') {
      if (playerRef.current) {
        playerRef.current.audio.current.currentTime = 0
        playerRef.current.audio.current.play()
      }
    } else if (repeatMode === 'all') {
      if (currentIndex === playlist.length - 1) {
        setCurrentIndex(0)
      } else {
        handleClickNext()
      }
    } else if (currentIndex < playlist.length - 1) {
      handleClickNext()
    }
  }

  const toggleRepeatMode = () => {
    setRepeatMode(current => {
      if (current === 'none') return 'all'
      if (current === 'all') return 'one'
      return 'none'
    })
  }

  const customProgressBarSection = [
    'CURRENT_TIME',
    'PROGRESS_BAR',
    'DURATION',
  ]

  const customControlsSection = [
    'MAIN_CONTROLS',
    'VOLUME_CONTROLS',
  ]

  const customDuration = (duration) => formatTime(duration)
  const customCurrentTime = (currentTime) => formatTime(currentTime)

  // Audio Player event handlers ekle
  const handlePlay = () => {
    navigator.mediaSession.playbackState = 'playing'
  }

  const handlePause = () => {
    navigator.mediaSession.playbackState = 'paused'
  }

  if (!playlist[currentIndex]) return null

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <IoMdMusicalNote className="text-blue-500" />
            <span className="font-medium dark:text-white">{playlist[currentIndex]?.name}</span>
          </div>
          <button 
            onClick={toggleRepeatMode}
            className={`p-2 rounded-full ${
              repeatMode !== 'none' 
                ? 'text-blue-500 dark:text-blue-400' 
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {repeatMode === 'one' ? <TbRepeatOnce size={20} /> : <TbRepeat size={20} />}
          </button>
        </div>
        <AudioPlayer
          ref={playerRef}
          src={playlist[currentIndex]?.path}
          autoPlay
          className="rounded-lg dark:bg-gray-700"
          showSkipControls={true}
          showJumpControls={true}
          onClickPrevious={handleClickPrevious}
          onClickNext={handleClickNext}
          onEnded={handleEnded}
          loop={false} // We handle looping manually
          layout="stacked-reverse"
          customProgressBarSection={customProgressBarSection}
          customControlsSection={customControlsSection}
          defaultCurrentTime="00:00"
          defaultDuration="00:00"
          customAdditionalControls={[]}
          showFilledProgress={true}
          progressUpdateInterval={100}
          onPlay={handlePlay}
          onPause={handlePause}
        />
      </div>
    </motion.div>
  )
}

export default MusicPlayer
