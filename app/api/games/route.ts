import { NextResponse } from 'next/server'
import path from 'path'
import { promises as fs } from 'fs'

interface Game {
  name: string
  image: string
  url: string
  new: boolean
}

export async function GET() {
  const filePath = path.join(process.cwd(), 'config', 'games.json')
  
  try {
    // Read the games.json file from the config directory
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
    
    // Prioritize specific games at the top - optimized single-pass
    const priorityGames = ['Polytrack', 'Geometry Dash', 'Duck Life 1', 'Duck Life 2', 'Duck Life 3', 'Duck Life 4']
    const prioritized: Game[] = []
    const rest: Game[] = []
    
    games.forEach((game: Game) => {
      if (priorityGames.includes(game.name)) {
        prioritized.push(game)
      } else {
        rest.push(game)
      }
    })
    
    // Sort prioritized games to match the order in priorityGames array
    prioritized.sort((a, b) => {
      return priorityGames.indexOf(a.name) - priorityGames.indexOf(b.name)
    })
    
    const sortedGames = [...prioritized, ...rest]
    
    return NextResponse.json(sortedGames, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
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
