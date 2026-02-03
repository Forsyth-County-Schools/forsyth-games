import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

// Cache duration constants
const ONE_HOUR = 3600;
const ONE_DAY = 86400;
const ONE_WEEK = 604800;

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
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    // Await params in Next.js 15+
    const params = await context.params;
    
    // Get the path segments
    const pathSegments = params.path || [];
    let gamePath = pathSegments.join('/');
    
    // Check if the first segment is a URL-encoded full URL
    if (pathSegments.length === 1 && pathSegments[0].includes('%')) {
      try {
        const decodedUrl = decodeURIComponent(pathSegments[0]);
        if (decodedUrl.startsWith('http://') || decodedUrl.startsWith('https://')) {
          gamePath = decodedUrl;
        }
      } catch (error) {
        // If decoding fails, use the original path
        console.warn('Failed to decode URL parameter:', error);
      }
    }
    
    if (!gamePath) {
      return new NextResponse('Missing game path', { 
        status: 400,
        headers: corsHeaders 
      });
    }

    // Build the target URL
    let targetUrl: string;
    
    // Check if the path is already a full URL (starts with http:// or https://)
    if (gamePath.startsWith('http://') || gamePath.startsWith('https://')) {
      targetUrl = gamePath;
    } else {
      // All games should now be full URLs - reject relative paths
      return new NextResponse(
        JSON.stringify({
          error: 'Invalid game URL - only full URLs are supported',
          path: gamePath
        }), 
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      );
    }
    
    console.log(`Proxying game request: ${targetUrl}`);

    // Fetch the game content with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout for games
    
    try {
      const response = await fetch(targetUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': request.headers.get('user-agent') || 'Mozilla/5.0',
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
        cacheControl = `public, max-age=${ONE_HOUR}, s-maxage=${ONE_HOUR}, stale-while-revalidate=${ONE_DAY}`;
      } else {
        // Cache assets more aggressively
        cacheControl = `public, max-age=${ONE_DAY}, s-maxage=${ONE_DAY}, stale-while-revalidate=${ONE_WEEK}, immutable`;
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

      // For text-based content (HTML, CSS, JS), rewrite URLs to go through Vercel proxy
      if (contentType.includes('text/html') || 
          contentType.includes('text/css') || 
          contentType.includes('application/javascript') ||
          contentType.includes('text/javascript')) {
        
        let content = await response.text();
        
        // Get the base URL for this request
        const requestUrl = new URL(request.url);
        const vercelProxyBase = `${requestUrl.protocol}//${requestUrl.host}/api/game`;
        
        // Extract the game name from the path (first segment)
        const gameId = pathSegments[0];
        
        // Rewrite various URL patterns to go through Vercel proxy
        // Pattern 1: Absolute URLs to GitHub
        content = content.replace(
          new RegExp(`https?://gms\\.parcoil\\.com/${gameId}/`, 'g'),
          `${vercelProxyBase}/${gameId}/`
        );
        content = content.replace(
          new RegExp(`https?://gms\\.parcoil\\.com/`, 'g'),
          `${vercelProxyBase}/`
        );
        
        // Pattern 2: Protocol-relative URLs
        content = content.replace(
          new RegExp(`//gms\\.parcoil\\.com/${gameId}/`, 'g'),
          `${vercelProxyBase}/${gameId}/`
        );
        content = content.replace(
          new RegExp(`//gms\\.parcoil\\.com/`, 'g'),
          `${vercelProxyBase}/`
        );
        
        // Pattern 3: Relative paths that might reference the root
        // Make sure paths starting with / in the game context go through proxy
        if (contentType.includes('text/html')) {
          // In HTML, replace src and href attributes that point to absolute paths
          content = content.replace(
            /(<(?:script|link|img|source|iframe)[^>]*(?:src|href)=["'])\/(?!api\/game)/gi,
            `$1${vercelProxyBase}/${gameId}/`
          );
          
          // Pattern 4: Handle relative paths (not starting with / or http)
          // Replace relative paths in src/href to go through proxy
          content = content.replace(
            /(<(?:script|link|img|source|iframe)[^>]*(?:src|href)=["'])(?!https?:\/\/|\/\/|\/|data:|blob:|#)([^"']+)(["'])/gi,
            `$1${vercelProxyBase}/${gameId}/$2$3`
          );
          
          // Pattern 5: Handle JavaScript string literals in Ruffle/Flash player loading
          // Replace patterns like player.load("file.swf") with proper proxy paths
          content = content.replace(
            /(player\.load\(["'])(?!https?:\/\/|\/\/|\/|data:|blob:)([^"']+)(["']\))/gi,
            `$1${vercelProxyBase}/${gameId}/$2$3`
          );
          
          // Pattern 6: Handle other common JavaScript asset loading patterns
          // Replace patterns like loadMovie("file.swf") or similar
          content = content.replace(
            /((?:loadMovie|loadSound|load)\(["'])(?!https?:\/\/|\/\/|\/|data:|blob:)([^"']+)(["']\))/gi,
            `$1${vercelProxyBase}/${gameId}/$2$3`
          );
          
          // Pattern 7: Handle XMLHttpRequest and fetch API calls with relative URLs
          content = content.replace(
            /((?:fetch|XMLHttpRequest\.open)\([^"']*["'])(?!https?:\/\/|\/\/|\/|data:|blob:)([^"']+)(["'])/gi,
            `$1${vercelProxyBase}/${gameId}/$2$3`
          );
          
          // Pattern 8: Handle Unity and game engine asset paths
          // Replace relative paths in game configuration and asset loading
          content = content.replace(
            /(["'])assets\/([^"']+)(["'])/gi,
            `$1${vercelProxyBase}/${gameId}/assets/$2$3`
          );
          
          // Pattern 9: Handle general relative file references in JavaScript strings
          // This catches patterns like "file.ext" that aren't in HTML attributes
          content = content.replace(
            /(["'])(?!https?:\/\/|\/\/|\/|data:|blob:|#|\.)([a-zA-Z0-9_-]+\.(swf|json|js|css|png|jpg|jpeg|gif|ogg|mp3|wav))(["'])/gi,
            `$1${vercelProxyBase}/${gameId}/$2$3`
          );
        }
        
        // Remove content-length header as we modified the content
        responseHeaders.delete('content-length');
        
        return new NextResponse(content, {
          status: 200,
          headers: Object.fromEntries(responseHeaders.entries())
        });
      }

      // For binary content, pass through as-is
      const content = await response.arrayBuffer();
      
      return new NextResponse(content, {
        status: 200,
        headers: Object.fromEntries(responseHeaders.entries())
      });
      
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error('Fetch error:', fetchError);
      
      // Return 404 for missing assets to help with debugging
      // Some games may need these files, while others work without them
      return new NextResponse(
        JSON.stringify({ 
          error: 'Failed to fetch game resource',
          message: fetchError instanceof Error ? fetchError.message : 'Unknown error',
          url: targetUrl,
          path: gamePath
        }),
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
            'Cache-Control': `public, max-age=${ONE_HOUR}`
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
