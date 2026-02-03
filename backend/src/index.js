const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3001;

// Game server URL
// All games now use GitHub URLs - no game server needed
// const GAME_SERVER_URL = 'removed';

// Middleware
// NOTE: frameguard is disabled to allow game embedding in iframes from any domain
// This is required for the game proxy functionality but could expose to clickjacking
// Consider implementing domain whitelisting if this becomes a security concern
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for iframe content
  frameguard: false, // Disable X-Frame-Options to allow iframe embedding
}));
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Proxy endpoint for games
app.get('/game/:gameId', async (req, res) => {
  const { gameId } = req.params;
  
  try {
    // Add trailing slash as the game server expects it
    const gameUrl = `${GAME_SERVER_URL}/${gameId}/`;
    
    // Fetch the game content using Node.js built-in fetch
    const response = await fetch(gameUrl, {
      headers: {
        'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0',
        'Referer': GAME_SERVER_URL,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get content type
    const contentType = response.headers.get('content-type') || 'text/html';
    
    // Set headers for the response
    res.set({
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    // Remove X-Frame-Options to allow iframe embedding from any domain

    // Get the response as text and send it
    const content = await response.text();
    res.send(content);
    
  } catch (error) {
    console.error(`Error proxying game ${gameId}:`, error);
    res.status(500).json({
      error: 'Failed to load game',
      message: 'The game could not be loaded at this time. Please try again later.',
      gameId: gameId
    });
  }
});

// Serve game assets (CSS, JS, images)
app.get('/game/:gameId/*', async (req, res) => {
  const { gameId } = req.params;
  const assetPath = req.params[0];
  
  try {
    const assetUrl = `${GAME_SERVER_URL}/${gameId}/${assetPath}`;
    
    const response = await fetch(assetUrl, {
      headers: {
        'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0',
        'Referer': GAME_SERVER_URL,
        'Accept': req.headers['accept'] || '*/*',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    
    res.set({
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600', // Cache assets for 1 hour
      'Access-Control-Allow-Headers': 'Content-Type',
    });

    // Handle different content types appropriately
    if (contentType.includes('application/json') || contentType.includes('text/')) {
      const content = await response.text();
      res.send(content);
    } else {
      const content = await response.arrayBuffer();
      res.send(Buffer.from(content));
    }
    
  } catch (error) {
    console.error(`Error proxying asset ${assetPath}:`, error);
    
    // For missing JS/CSS files, return empty content to prevent breaking games
    if (assetPath.endsWith('.js') || assetPath.endsWith('.css')) {
      res.set({
        'Content-Type': assetPath.endsWith('.js') ? 'text/javascript' : 'text/css',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600',
      });
      return assetPath.endsWith('.js') ? 
        res.send('// Asset not found') : 
        res.send('/* Asset not found */');
    }
    
    res.status(404).json({
      error: 'Asset not found',
      message: 'The requested game asset could not be found.',
      path: assetPath
    });
  }
});

// Catch-all for other assets (like js/main.js, css files, etc.)
app.get('/*', async (req, res) => {
  const assetPath = req.path.substring(1); // Remove leading slash
  
  try {
    const assetUrl = `${GAME_SERVER_URL}/${assetPath}`;
    
    const response = await fetch(assetUrl, {
      headers: {
        'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0',
        'Referer': GAME_SERVER_URL,
        'Accept': req.headers['accept'] || '*/*',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    
    res.set({
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Headers': 'Content-Type',
    });

    // Handle different content types appropriately
    if (contentType.includes('application/json') || contentType.includes('text/')) {
      const content = await response.text();
      res.send(content);
    } else {
      const content = await response.arrayBuffer();
      res.send(Buffer.from(content));
    }
    
  } catch (error) {
    console.error(`Error proxying asset ${assetPath}:`, error);
    
    // For missing JS/CSS files, return empty content to prevent breaking games
    if (assetPath.endsWith('.js') || assetPath.endsWith('.css')) {
      res.set({
        'Content-Type': assetPath.endsWith('.js') ? 'text/javascript' : 'text/css',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600',
      });
      return assetPath.endsWith('.js') ? 
        res.send('// Asset not found') : 
        res.send('/* Asset not found */');
    }
    
    res.status(404).json({
      error: 'Asset not found',
      message: 'The requested asset could not be found.',
      path: assetPath
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Forsyth Games Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      gameProxy: '/game/:gameId',
      gameAssets: '/game/:gameId/*'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong on our end. Please try again later.'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: 'The requested endpoint was not found.',
    availableEndpoints: ['/health', '/game/:gameId', '/game/:gameId/*']
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎮 Forsyth Games Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 Game proxy: http://localhost:${PORT}/game/[gameId]`);
});

module.exports = app;
