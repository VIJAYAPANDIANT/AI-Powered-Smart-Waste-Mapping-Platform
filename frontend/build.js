const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'config.js');

// Read BACKEND_URL from environment variables, fallback to the latest deployed backend URL
const backendUrl = process.env.BACKEND_URL || 'https://ai-powered-smart-waste-mapp-git-7fbbd2-vijayapndian-ts-projects.vercel.app';

console.log('Injecting Backend API URL:', backendUrl);

const configContent = `// SmartWaste API Configuration
// Generated dynamically during Vercel build phase from environment variables
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : '${backendUrl}';
`;

fs.writeFileSync(configPath, configContent, 'utf8');
console.log('config.js successfully updated with backend URL.');
