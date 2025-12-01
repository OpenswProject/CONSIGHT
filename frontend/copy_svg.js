const fs = require('fs');
const path = require('path');

const sourcePath = path.join('C:', 'Users', 'diffi', 'Desktop', 'frontend', 'mainpage reference', 'mdi-account-cog0.svg');
const destinationPath = path.join('C:', 'Users', 'diffi', 'Desktop', 'frontend', 'public', 'mdi-account-cog0.svg');

try {
  fs.copyFileSync(sourcePath, destinationPath);
  console.log('File copied successfully!');
} catch (error) {
  console.error('Error copying file:', error);
}
