const { spawn } = require('child_process');
const path = require('path');

function start() {
  const p = spawn('node', [
    path.join(__dirname, 'node_modules', 'tsx', 'dist', 'cli.mjs'),
    path.join(__dirname, 'src', 'index.ts')
  ], {
    cwd: __dirname,
    stdio: 'inherit',
    env: { ...process.env, PORT: '3001' }
  });

  p.on('exit', (code) => {
    console.log(`Server exited with code ${code}, restarting...`);
    setTimeout(start, 2000);
  });

  p.on('error', (err) => {
    console.error('Failed to start:', err);
  });
}

start();
