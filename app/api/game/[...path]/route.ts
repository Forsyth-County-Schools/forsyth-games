import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

const GAME_SERVER_URL = 'https://gms.parcoil.com';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      ...corsHeaders,
      'Content-Length': '0'
    }
  });
}

// Handle GET requests to proxy game content
export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // Get the path segments
    const pathSegments = params.path || [];
    const gamePath = pathSegments.join('/');
    
    if (!gamePath) {
      return new NextResponse('Missing game path', { 
        status: 400,
        headers: corsHeaders 
      });
    }

    // Build the target URL - ensure trailing slash for game directories
    const targetUrl = `${GAME_SERVER_URL}/${gamePath}${gamePath && !gamePath.includes('.') ? '/' : ''}`;
    
    console.log(`Proxying game request: ${targetUrl}`);

    // Fetch the game content with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout for games
    
    try {
      const response = await fetch(targetUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': request.headers.get('user-agent') || 'Mozilla/5.0',
          'Referer': GAME_SERVER_URL,
          'Accept': request.headers.get('accept') || '*/*',
        },
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(`Failed to fetch ${targetUrl}: ${response.status} ${response.statusText}`);
        return new NextResponse(
          JSON.stringify({
            error: 'Failed to fetch game resource',
            status: response.status,
            statusText: response.statusText,
            url: targetUrl
          }), 
          { 
            status: response.status,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          }
        );
      }

      // Get the content type from the response
      const contentType = response.headers.get('content-type') || 'application/octet-stream';
      
      // Determine cache control based on content type
      let cacheControl;
      if (contentType.includes('text/html')) {
        cacheControl = 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400';
      } else {
        // Cache assets more aggressively
        cacheControl = 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800, immutable';
      }

      // Create response headers
      const responseHeaders = new Headers();
      responseHeaders.set('Content-Type', contentType);
      responseHeaders.set('Cache-Control', cacheControl);
      responseHeaders.set('Access-Control-Allow-Origin', '*');
      responseHeaders.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
      responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      // Copy useful headers from the original response
      const allowedHeaders = [
        'content-encoding',
        'content-length',
        'etag',
        'last-modified'
      ];
      
      allowedHeaders.forEach(header => {
        const value = response.headers.get(header);
        if (value) responseHeaders.set(header, value);
      });

      // Get the content as array buffer to handle binary files
      const content = await response.arrayBuffer();
      
      return new NextResponse(content, {
        status: 200,
        headers: Object.fromEntries(responseHeaders.entries())
      });
      
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error('Fetch error:', fetchError);
      
      // For missing JS/CSS files, return empty content to prevent breaking games
      if (gamePath.endsWith('.js')) {
        return new NextResponse('// Game asset not found', {
          status: 200,
          headers: {
            'Content-Type': 'text/javascript',
            ...corsHeaders,
            'Cache-Control': 'public, max-age=3600'
          }
        });
      }
      
      if (gamePath.endsWith('.css')) {
        return new NextResponse('/* Game asset not found */', {
          status: 200,
          headers: {
            'Content-Type': 'text/css',
            ...corsHeaders,
            'Cache-Control': 'public, max-age=3600'
          }
        });
      }
      
      return new NextResponse(
        JSON.stringify({ 
          error: 'Failed to fetch game resource',
          message: fetchError instanceof Error ? fetchError.message : 'Unknown error',
          url: targetUrl
        }),
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      );
    }
  } catch (error) {
    console.error('Game proxy error:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  }
}
