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
          'User-Agent': request.headers.get('user-agent') || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': request.headers.get('accept') || 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Encoding': 'identity', // Prevent compression to avoid encoding issues
          'Cache-Control': 'no-cache'
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
      let contentType = response.headers.get('content-type') || '';
      
      // Force HTML content type for HTML files if not set properly
      if (!contentType && (targetUrl.endsWith('.html') || targetUrl.includes('index.html'))) {
        contentType = 'text/html; charset=utf-8';
      } else if (contentType && !contentType.includes('charset') && contentType.includes('text/html')) {
        contentType = 'text/html; charset=utf-8';
      }
      
      // Set default if still empty
      if (!contentType) {
        contentType = 'application/octet-stream';
      }
      
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
      
      // Copy useful headers from the original response, but exclude encoding headers
      // since we might modify the content
      const allowedHeaders = [
        'etag',
        'last-modified'
      ];
      
      allowedHeaders.forEach(header => {
        const value = response.headers.get(header);
        if (value) responseHeaders.set(header, value);
      });

      // For HTML content from GitHub games, do minimal URL rewriting
      if (contentType.includes('text/html')) {
        let content = await response.text();
        
        // Get the base directory URL from the GitHub URL
        const baseDir = targetUrl.substring(0, targetUrl.lastIndexOf('/') + 1);
        
        // Only fix relative URLs that don't already start with http/https
        // This handles things like src="script.js" -> src="https://raw.githubusercontent.com/.../script.js"
        content = content.replace(
          /((?:src|href|action)=["'])(?!https?:\/\/|\/\/|data:|#)([^"']+)(["'])/g,
          (match, prefix, url, suffix) => {
            // Skip if it's already an absolute path or data URL
            if (url.startsWith('/') || url.includes('://')) {
              return match;
            }
            return `${prefix}${baseDir}${url}${suffix}`;
          }
        );
        
        // Remove content-length header as we modified the content
        responseHeaders.delete('content-length');
        responseHeaders.delete('content-encoding');
        
        // Ensure proper content type for HTML
        responseHeaders.set('Content-Type', 'text/html; charset=utf-8');
        responseHeaders.set('X-Content-Type-Options', 'nosniff');
        
        // Add headers to ensure proper rendering in iframe
        responseHeaders.set('Content-Security-Policy', "frame-ancestors 'self' http://localhost:* https://*.vercel.app");
        responseHeaders.set('Referrer-Policy', 'no-referrer-when-downgrade');
        
        return new NextResponse(content, {
          status: 200,
          headers: Object.fromEntries(responseHeaders.entries())
        });
      }

      // For binary content, pass through as-is but ensure proper headers
      const content = await response.arrayBuffer();
      
      // Don't copy content-encoding for binary content to avoid decoding issues
      responseHeaders.delete('content-encoding');
      // Keep content-length for binary content if available
      const originalLength = response.headers.get('content-length');
      if (originalLength) {
        responseHeaders.set('content-length', originalLength);
      }
      
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
