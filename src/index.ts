if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const required = ['DISCORD_TOKEN', 'ODDS_API_KEY'];
for (const name of required) {
  if (!process.env[name]) {
    console.error(`Missing required env var: ${name}`);
    process.exit(1);
  }
}
console.log('All required env vars present.');

console.log('FloryderBot starting (minimal entry)')

// Graceful shutdown
async function shutdown(code = 0) {
  try {
    console.log('Shutting down...');
    // if (client && typeof client.destroy === 'function') await client.destroy();
  } catch (err) {
    console.error('Error while shutting down', err);
  } finally {
    process.exit(code);
  }
}
process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

// Keep process alive for development/testing
setInterval(() => {
  // heartbeat
  process.stdout.write('.')
}, 60_000)

