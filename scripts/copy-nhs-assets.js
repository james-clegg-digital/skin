const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();
const source = path.join(projectRoot, 'node_modules', 'nhsuk-frontend', 'dist', 'nhsuk', 'assets');
const destination = path.join(projectRoot, 'public', 'assets');

async function copyAssets() {
  if (!fs.existsSync(source)) {
    console.warn('nhsuk-frontend assets not found; install dependencies first.');
    return;
  }

  await fs.promises.mkdir(destination, { recursive: true });
  await fs.promises.cp(source, destination, { recursive: true });
  console.log('Copied nhsuk-frontend assets to public/assets');
}

copyAssets().catch((err) => {
  console.error('Failed to copy nhsuk-frontend assets', err);
  process.exit(1);
});
