import { NextRequest, NextResponse } from 'next/server'

/**
 * YouTube URL Resolution API
 * Validates YouTube URLs and returns embeddable URLs
 */

// YouTube URL patterns
const YOUTUBE_PATTERNS = [
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})(?:&|$)/,
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})(?:\?|$)/,
  /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]{11})(?:\?|$)/,
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([a-zA-Z0-9_-]{11})(?:\?|$)/,
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})(?:\?|$)/,
]

/**
 * Extract and validate YouTube video ID from URL
 */
function extractVideoId(url: string): string | null {
  if (!url || typeof url !== 'string') {
    return null
  }

  // Trim whitespace
  const trimmedUrl = url.trim()

  // Try each pattern
  for (const pattern of YOUTUBE_PATTERNS) {
    const match = trimmedUrl.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return null
}

/**
 * Validate video ID format
 */
function isValidVideoId(videoId: string): boolean {
  return /^[a-zA-Z0-9_-]{11}$/.test(videoId)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url } = body

    // Validate input
    if (!url) {
      return NextResponse.json(
        { error: 'YouTube URL is required' },
        { status: 400 }
      )
    }

    // Extract video ID
    const videoId = extractVideoId(url)

    if (!videoId) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL. Please provide a valid YouTube video link.' },
        { status: 400 }
      )
    }

    // Additional validation
    if (!isValidVideoId(videoId)) {
      return NextResponse.json(
        { error: 'Invalid video ID format' },
        { status: 400 }
      )
    }

    // Return the embeddable URL
    const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`

    return NextResponse.json(
      {
        success: true,
        videoId,
        embedUrl,
      },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    )
  } catch (error) {
    console.error('Error processing YouTube URL:', error)
    return NextResponse.json(
      { error: 'Failed to process YouTube URL' },
      { status: 500 }
    )
  }
}
