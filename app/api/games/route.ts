import { NextResponse } from 'next/server'
import path from 'path'
import { promises as fs } from 'fs'

export async function GET() {
  try {
    // Read the games.json file from the public directory
    const filePath = path.join(process.cwd(), 'public', 'config', 'games.json')
    const fileContents = await fs.readFile(filePath, 'utf8')
    const games = JSON.parse(fileContents)
    
    return NextResponse.json(games, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Error reading games.json:', error)
    return NextResponse.json(
      { error: 'Failed to load games' },
      { status: 500 }
    )
  }
}
