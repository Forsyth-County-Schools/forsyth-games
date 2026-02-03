import { useRouter } from 'next/router';
import Head from 'next/head';

export default function GamePage() {
  const router = useRouter();
  const { slug } = router.query;
  const gameId = slug?.[0] || '';
  
  // List of locally hosted games
  const localGames = ['madalin-stunt-cars-2', 'ducklife4', 'ducklife5', 'geodash', 'polytrack'];
  
  // Check if this is a locally hosted game
  const isLocalGame = localGames.includes(gameId);
  
  if (!isLocalGame) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Game Not Found</h1>
          <p className="mb-4">The requested game could not be found on our servers.</p>
          <button 
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }
  
  // Direct URL to the game's index.html
  const gameUrl = `/games/${gameId}/index.html`;
  
  return (
    <div className="w-full h-screen bg-black">
      <Head>
        <title>Playing Game | Forsyth Games</title>
        <meta name="description" content={`Play ${gameId} on Forsyth Games`} />
      </Head>
      
      <div className="absolute top-4 left-4 z-10">
        <button 
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          ← Back to Games
        </button>
      </div>
      
      <iframe 
        src={gameUrl}
        className="w-full h-full border-0"
        allowFullScreen
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  );
}
