import { NextResponse } from 'next/server'
import { getAudioUrl } from '@/utils/youtubeConverter'

export async function POST(request) {
  try {
    const { youtubeUrl } = await request.json()
    const audioUrl = await getAudioUrl(youtubeUrl)

    if (!audioUrl) {
      return NextResponse.json({ error: 'Could not extract audio URL' }, { status: 400 })
    }

    return NextResponse.json({ audioUrl })
  } catch (error) {
    return NextResponse.json({ error: 'Conversion failed' }, { status: 500 })
  }
}
