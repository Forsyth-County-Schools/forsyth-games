import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle both GET and OPTIONS methods
export async function GET(request: NextRequest) {
  // Handle OPTIONS request for CORS preflight
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        ...corsHeaders,
        'Content-Length': '0'
      }
    });
  }
  try {
    // Get the path from the URL
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return new NextResponse('Missing URL parameter', { status: 400 });
    }

    // Validate URL to prevent SSRF
    let targetUrl: URL;
    try {
      targetUrl = new URL(url);
      
      // Get allowed domains from environment variable with fallback
      const allowedDomains = process.env.ALLOWED_GAME_DOMAINS?.split(',').map(d => d.trim()) || [
        'www.crazygames.com',
        '*.parcoil.com',
        '*.crazygames.com',
        'site.imsglobal.org',
        'cdn.jsdelivr.net',
        '*.cloudflare.com',
        'raw.githubusercontent.com',
        'github.com'
      ];

      const isDomainAllowed = allowedDomains.some(domain => {
        // Handle wildcard subdomains
        if (domain.startsWith('*.')) {
          const domainWithoutWildcard = domain.substring(2);
          return (
            targetUrl.hostname === domainWithoutWildcard ||
            targetUrl.hostname.endsWith(`.${domainWithoutWildcard}`)
          );
        }
        return targetUrl.hostname === domain;
      });

      if (!isDomainAllowed) {
        return new NextResponse(
          JSON.stringify({
            error: 'Domain not allowed',
            requested: targetUrl.hostname,
            allowedDomains
          }), 
          { 
            status: 403,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, OPTIONS'
            }
          }
        );
      }
    } catch (error) {
      console.error('Invalid URL:', error);
      return new NextResponse('Invalid URL', { status: 400 });
    }

    // Fetch the external resource with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      const response = await fetch(targetUrl.toString(), {
        signal: controller.signal,
        headers: {
          'User-Agent': request.headers.get('user-agent') || '',
          'Referer': targetUrl.origin,
          ...(request.headers.get('accept') && { 'Accept': request.headers.get('accept')! }),
        },
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        return new NextResponse(
          JSON.stringify({
            error: 'Failed to fetch resource',
            status: response.status,
            statusText: response.statusText,
            url: targetUrl.toString()
          }), 
          { 
            status: response.status,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, OPTIONS'
            }
          }
        );
      }

          // Get the content type from the response or default to octet-stream
      const contentType = response.headers.get('content-type') || 'application/octet-stream';

      // Get cache control from response or use default
      const cacheControl = response.headers.get('cache-control') || 
                         'public, max-age=86400, s-maxage=86400, stale-while-revalidate=3600';

      // Create response headers
      const responseHeaders = new Headers();
      responseHeaders.set('Content-Type', contentType);
      responseHeaders.set('Cache-Control', cacheControl);
      responseHeaders.set('Access-Control-Allow-Origin', '*');
      responseHeaders.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
      responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      // Copy allowed headers from the original response
      const allowedHeaders = [
        'content-encoding',
        'content-length',
        'content-range',
        'content-type',
        'etag',
        'last-modified'
      ];
      
      allowedHeaders.forEach(header => {
        const value = response.headers.get(header);
        if (value) responseHeaders.set(header, value);
      });

      // Create a new response with the fetched content
      const content = await response.arrayBuffer();
      
      return new NextResponse(content, {
        status: response.status,
        headers: Object.fromEntries(responseHeaders.entries())
      });
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      return new NextResponse(
        JSON.stringify({ error: 'Failed to fetch resource' }),
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
    console.error('Proxy error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
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
