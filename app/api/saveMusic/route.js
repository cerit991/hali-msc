import { NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function POST(request) {
  try {
    const data = await request.formData()
    const file = data.get('file')
    const name = data.get('name')

    if (!file) {
      return NextResponse.json({ error: 'No file received' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Ensure music directory exists
    const musicDir = join(process.cwd(), 'public', 'music')
    try {
      await mkdir(musicDir, { recursive: true })
    } catch (error) {
      if (error.code !== 'EEXIST') throw error
    }

    // Save the file
    const filename = `${Date.now()}-${file.name}`
    const filepath = join(musicDir, filename)
    await writeFile(filepath, buffer)

    // Update JSON
    const dbPath = join(process.cwd(), 'public', 'musicData.json')
    let songs = []
    try {
      const content = await readFile(dbPath, 'utf8')
      songs = JSON.parse(content)
    } catch (error) {
      // File doesn't exist or is empty
    }

    songs.push({
      id: Date.now(),
      name: name,
      filename: filename,
      path: `/music/${filename}`
    })

    await writeFile(dbPath, JSON.stringify(songs, null, 2))

    return NextResponse.json({ message: 'Music saved successfully' })
  } catch (error) {
    console.error('Error saving music:', error)
    return NextResponse.json({ error: 'Failed to save music' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'public', 'musicData.json')
    const fileContent = await readFile(filePath, 'utf8')
    const songs = JSON.parse(fileContent)
    
    return NextResponse.json({ data: songs }, { status: 200 })
  } catch (error) {
    console.error('Error reading songs:', error)
    return NextResponse.json({ data: [] }, { status: 200 })
  }
}
