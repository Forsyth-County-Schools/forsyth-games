import { NextResponse } from 'next/server'
import path from 'path'
import { promises as fs } from 'fs'

export async function GET() {
  const filePath = path.join(process.cwd(), 'public', 'config', 'games.json')
  
  try {
    // Read the games.json file from the public directory
    const fileContents = await fs.readFile(filePath, 'utf8')
    
    // Parse JSON with explicit error handling
    let games
    try {
      games = JSON.parse(fileContents)
    } catch (parseError) {
      console.error(`Error parsing JSON from ${filePath}:`, parseError)
      return NextResponse.json(
        { error: 'Invalid games data format' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(games, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error(`Error reading games.json from ${filePath}:`, error)
    return NextResponse.json(
      { error: 'Failed to load games' },
      { status: 500 }
    )
  }
}
