const fs = require('fs').promises;
const path = require('path');

// List of games we have locally
const localGames = [
  'madalin-stunt-cars-2',
  'ducklife4',
  'ducklife5',
  'geodash',
  'polytrack'
];

async function updateGamePaths() {
  try {
    // Read the current games.json
    const gamesPath = path.join(__dirname, '../config/games.json');
    const gamesData = await fs.readFile(gamesPath, 'utf8');
    let games = JSON.parse(gamesData);
    
    // Update game paths for local games
    games = games.map(game => {
      // Skip if not a local game
      if (!localGames.includes(game.url)) {
        return game;
      }
      
      // Update the URL to point to our local path
      return {
        ...game,
        // Keep the same URL for routing, but ensure image path is correct
        image: game.image.startsWith('http') ? game.image : `/games/${game.url}/${game.image}`
      };
    });
    
    // Save the updated games.json
    await fs.writeFile(gamesPath, JSON.stringify(games, null, 2));
    console.log('✅ Successfully updated game paths');
    
  } catch (error) {
    console.error('Error updating game paths:', error);
  }
}

updateGamePaths();
