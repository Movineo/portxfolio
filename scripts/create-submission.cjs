const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Create submission directory if it doesn't exist
const submissionDir = path.join(__dirname, '../submission');
if (!fs.existsSync(submissionDir)) {
  fs.mkdirSync(submissionDir);
}

// Create a write stream for our zip file
const output = fs.createWriteStream(path.join(submissionDir, 'portxfolio-submission.zip'));
const archive = archiver('zip', {
  zlib: { level: 9 } // Maximum compression
});

// Listen for errors
archive.on('error', function(err) {
  throw err;
});

// Pipe archive data to the file
archive.pipe(output);

// Add the main project files
archive.glob('src/**/*', { ignore: ['**/node_modules/**', '**/.git/**'] });
archive.glob('public/**/*');
archive.glob('server/**/*');
archive.file('README.md');
archive.file('package.json');
archive.file('tsconfig.json');
archive.file('vite.config.ts');
archive.file('.env.example');

// Add documentation
const docs = {
  'FEATURES.md': `# PortXfolio Features

## Core Features
1. AI-Powered Chat Assistant
   - Context-aware portfolio information
   - Natural language interaction
   - Suggested queries
   - Mobile-friendly interface

2. Dynamic 3D Background
   - Interactive particle system
   - Performance optimized
   - Responsive to user interaction

3. Professional Information Display
   - GitHub integration
   - Skills visualization
   - Project showcase
   - Contact form

4. Modern UI/UX
   - Dark/Light mode
   - Responsive design
   - Accessibility features
   - Smooth animations

## Technical Implementation
- Frontend: React, TypeScript, Three.js
- Backend: Node.js, Express
- AI: Hugging Face API
- Styling: TailwindCSS
- Animation: Framer Motion

## Security & Performance
- CORS protection
- Rate limiting
- Input validation
- Optimized asset loading
- Mobile optimization`,

  'INSTALLATION.md': `# Installation Guide

1. Clone the repository
2. Install dependencies: \`npm install\`
3. Configure environment variables
4. Start development server: \`npm run dev\`

## Environment Variables
- VITE_API_URL
- HUGGING_FACE_API_KEY

## Development
- Frontend: \`npm run dev\`
- Backend: \`node server/index.js\`

## Production
- Build: \`npm run build\`
- Start: \`npm start\`

## Testing
- Run tests: \`npm test\`
- Lint: \`npm run lint\``,

  'DEMO.md': `# Demo Guide

## Key Features to Showcase

1. AI Chat Assistant
   - Ask about skills and projects
   - Try suggested queries
   - Test natural conversation

2. Visual Elements
   - Toggle dark/light mode
   - Interact with 3D background
   - Check responsive design

3. Portfolio Content
   - View GitHub activity
   - Explore projects
   - Test contact form

## Example Interactions
- "Tell me about your skills"
- "What projects have you worked on?"
- "How can I contact you?"

## Tips
- Test on different devices
- Try various screen sizes
- Explore all sections`
};

// Add documentation files
for (const [filename, content] of Object.entries(docs)) {
  archive.append(content, { name: `docs/${filename}` });
}

// Add screenshots directory
archive.directory('screenshots/', 'screenshots');

// Finalize the archive
archive.finalize();

console.log('Creating submission package...');
output.on('close', function() {
  console.log(`Submission package created successfully!`);
  console.log(`Total size: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Location: ${path.join(submissionDir, 'portxfolio-submission.zip')}`);
}); 