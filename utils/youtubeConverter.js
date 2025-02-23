import ytdl from 'ytdl-core'

export async function getAudioUrl(youtubeUrl) {
  try {
    const info = await ytdl.getInfo(youtubeUrl)
    const audioFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio', filter: 'audioonly' })
    
    return audioFormat.url
  } catch (error) {
    console.error('Error getting audio URL:', error)
    return null
  }
}

export async function getVideoDetails(youtubeUrl) {
  try {
    const info = await ytdl.getInfo(youtubeUrl)
    return {
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails[0].url
    }
  } catch (error) {
    console.error('Error getting video details:', error)
    return null
  }
}
