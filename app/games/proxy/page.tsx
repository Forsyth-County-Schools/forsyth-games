'use client'

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AlertTriangle, Loader2 } from 'lucide-react';

// Component that uses useSearchParams (must be wrapped in Suspense)
function ProxyGameContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const gameUrl = searchParams?.get('url');

  useEffect(() => {
    if (!gameUrl) {
      setError('No game URL provided');
      setIsLoading(false);
      return;
    }

    // Decode the URL
    let decodedUrl;
    try {
      decodedUrl = decodeURIComponent(gameUrl);
    } catch (err) {
      setError('Invalid game URL');
      setIsLoading(false);
      return;
    }

    // Verify it's a valid URL
    try {
      new URL(decodedUrl);
      setIsLoading(false);
    } catch (err) {
      setError('Invalid game URL format');
      setIsLoading(false);
    }
  }, [gameUrl]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium">Loading game...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-2xl mx-auto mt-20 p-6 bg-white rounded-lg shadow-lg">
          <div className="flex flex-col items-center text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Game</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!gameUrl) {
    return null;
  }

  return (
    <div className="w-full h-screen bg-black flex flex-col">
      <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center text-sm text-gray-300 hover:text-white"
        >
          ← Back to Games
        </button>
      </div>
      <div className="flex-1">
        <iframe
          src={gameUrl}
          className="w-full h-full border-0"
          title="Game"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
    </div>
  );
}

// Main component that wraps the content in a Suspense boundary
export default function ProxyGamePage() {
  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-lg font-medium">Loading game...</p>
          </div>
        </div>
      }
    >
      <ProxyGameContent />
    </Suspense>
  );
}
