require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const rateLimit = require('express-rate-limit');

const app = express();
const port = process.env.PORT || 3001;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Apply rate limiting to all routes
app.use(limiter);

// Portfolio specific information
const portfolioInfo = {
  owner: {
    name: "Movine Odhiambo",
    title: "Full-Stack Developer",
    education: "B.Sc. Mathematics & Computer Science from JKUAT",
    specialties: ["Frontend Development", "Backend Development", "Database Management", "Security"],
  },
  skills: {
    frontend: ["HTML5", "CSS3", "JavaScript (ES6+)", "React", "Framer Motion", "TailwindCSS"],
    backend: ["Node.js", "Express.js", "Spring Boot"],
    database: ["PostgreSQL", "MySQL", "ORM Patterns"],
    security: ["JWT Auth", "Role-Based Access"],
  },
  projects: [
    {
      title: "Event Management System",
      description: "Full-stack platform handling 1,000+ registrations with QR ticketing system",
      technologies: ["Node.js", "PostgreSQL"]
    },
    {
      title: "Developer Portfolio Platform",
      description: "Responsive portfolio with GitHub API integration and 95+ accessibility score",
      technologies: ["React", "JavaScript"]
    }
  ],
  contact: {
    email: "movineee@gmail.com",
    github: "https://github.com/Movineo",
    linkedin: "https://www.linkedin.com/in/movine-odhiambo-5b4b5935a"
  }
};

// CORS configuration
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://movinetr.xyz', 'https://www.movinetr.xyz', 'https://movineo.github.io']
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      console.log('Blocked origin:', origin);
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST'],
  credentials: true,
  maxAge: 86400 // CORS preflight cache for 24 hours
}));

app.use(express.json());

const HUGGING_FACE_API_URL = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-small';

// Helper function to check if message is portfolio-related
function isPortfolioQuery(message) {
  const lowerMessage = message.toLowerCase();
  const portfolioKeywords = [
    'skills', 'technologies', 'tech stack',
    'projects', 'work', 'portfolio',
    'contact', 'email', 'reach',
    'education', 'study', 'degree',
    'about', 'background', 'experience'
  ];
  
  return portfolioKeywords.some(keyword => lowerMessage.includes(keyword));
}

// Helper function to generate portfolio-specific responses
function generatePortfolioResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  // Common greetings with context
  if (lowerMessage.match(/^(hi|hello|hey|greetings)/)) {
    return `Hello! 👋 I'm Movine's portfolio assistant. I'm excited to help you learn about:\n\n` +
           `🔹 Skills & Technologies\n` +
           `🔹 Projects & Work Experience\n` +
           `🔹 Education & Background\n` +
           `🔹 Contact Information\n\n` +
           `What interests you the most? I'd love to share more details! 😊`;
  }

  // Name/Identity related queries
  if (lowerMessage.includes('movine') || lowerMessage.includes('who') || lowerMessage.includes('your name')) {
    return `🌟 Let me introduce you to Movine Odhiambo!\n\n` +
           `He's a passionate Full-Stack Developer who loves creating cutting-edge web applications. Here's what makes him stand out:\n\n` +
           `💻 Frontend Expertise:\n` +
           `• React & Modern JavaScript\n` +
           `• Responsive Design\n` +
           `• User Experience Focus\n\n` +
           `🛠️ Backend Mastery:\n` +
           `• Node.js & Express.js\n` +
           `• Spring Boot\n` +
           `• Database Architecture\n\n` +
           `🎓 Education:\n` +
           `B.Sc. in Mathematics & Computer Science from JKUAT\n\n` +
           `Would you like to know more about his projects or specific skills? Just ask! 😊`;
  }

  // Privacy/Security related queries
  if (lowerMessage.includes('read this') || lowerMessage.includes('private') || lowerMessage.includes('secure')) {
    return `🔒 Rest assured, our conversation is private to this session. I'm here to help you learn about Movine's professional journey and expertise.\n\n` +
           `Feel free to ask anything about his work, skills, or achievements! What would you like to know? 😊`;
  }

  // Skills related queries
  if (lowerMessage.includes('skills') || lowerMessage.includes('technologies') || lowerMessage.includes('tech stack')) {
    return `🚀 Here's Movine's impressive tech arsenal:\n\n` +
           `💻 Frontend Mastery:\n${portfolioInfo.skills.frontend.join(', ')}\n\n` +
           `⚙️ Backend Expertise:\n${portfolioInfo.skills.backend.join(', ')}\n\n` +
           `🗄️ Database Proficiency:\n${portfolioInfo.skills.database.join(', ')}\n\n` +
           `🔐 Security Implementation:\n${portfolioInfo.skills.security.join(', ')}\n\n` +
           `Want to know how he applies these skills in real projects? Just ask! 🎯`;
  }

  // Project related queries
  if (lowerMessage.includes('project') || lowerMessage.includes('work') || lowerMessage.includes('portfolio')) {
    return `🎯 Check out these exciting projects by Movine:\n\n` +
           portfolioInfo.projects.map(project => 
             `🌟 ${project.title}:\n` +
             `${project.description}\n` +
             `🛠️ Technologies: ${project.technologies.join(', ')}`
           ).join('\n\n') +
           '\n\nWould you like more details about any specific project? 😊';
  }

  // Contact information queries
  if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('reach')) {
    return `📬 Here's how you can connect with Movine:\n\n` +
           `📧 Email: ${portfolioInfo.contact.email}\n` +
           `💻 GitHub: ${portfolioInfo.contact.github}\n` +
           `🔗 LinkedIn: ${portfolioInfo.contact.linkedin}\n\n` +
           `Feel free to reach out - he's always excited to discuss new opportunities and ideas! 🤝`;
  }

  // Education related queries
  if (lowerMessage.includes('education') || lowerMessage.includes('study') || lowerMessage.includes('degree')) {
    return `🎓 Educational Background:\n\n` +
           `Movine holds a ${portfolioInfo.owner.education}\n\n` +
           `📚 Key Areas of Study:\n` +
           `• 🔍 Data Structures & Algorithms\n` +
           `• 💾 Database Systems\n` +
           `• 🌐 Web Development\n\n` +
           `Want to know how he applies this knowledge in real-world projects? Just ask! 💡`;
  }

  // Background/About queries
  if (lowerMessage.includes('about') || lowerMessage.includes('background') || lowerMessage.includes('experience')) {
    return `🌟 About Movine Odhiambo:\n\n` +
           `He's a ${portfolioInfo.owner.title} with a passion for creating innovative solutions. Here are some highlights:\n\n` +
           `🏆 Achievements:\n` +
           `• 🎯 Top 10% in university programming competitions\n` +
           `• 📚 50+ hours of specialized backend development training\n` +
           `• ✨ 100% code review approval rate\n\n` +
           `Would you like to know more about his skills, projects, or how to get in touch? 😊`;
  }

  // Lost/Confused queries
  if (lowerMessage.includes('lost') || lowerMessage.includes('help') || lowerMessage.includes('confused')) {
    return `🤝 No worries! I'm here to help. Let me guide you through what I can tell you about:\n\n` +
           `💻 Technical Skills & Expertise\n` +
           `🚀 Exciting Projects & Achievements\n` +
           `🎓 Education & Background\n` +
           `📬 Contact Information\n\n` +
           `What would you like to explore first? 😊`;
  }

  // Default response for unrecognized queries
  return `👋 I'd love to tell you more about Movine! You can ask about:\n\n` +
         `💻 His technical expertise\n` +
         `🚀 Projects he's worked on\n` +
         `🎓 Education and background\n` +
         `📬 How to get in touch\n\n` +
         `What would you like to know more about? I'm here to help! 😊`;
}

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string') {
      throw new Error('Invalid message format');
    }

    // First, try to generate a portfolio-specific response
    const portfolioResponse = generatePortfolioResponse(message.trim());
    if (portfolioResponse) {
      // Log interaction in production
      if (process.env.NODE_ENV === 'production') {
        console.log(`Chat interaction - Q: ${message} A: ${portfolioResponse}`);
      }
      return res.json({ response: portfolioResponse });
    }

    // If no portfolio response, use Hugging Face API as fallback
    const apiKey = process.env.HUGGING_FACE_API_KEY;
    if (!apiKey || !apiKey.startsWith('hf_')) {
      return res.json({ 
        response: "I'm best at answering questions about Movine's portfolio, skills, and experience. Could you try asking something specific about those topics?" 
      });
    }

    console.log('Sending request to Hugging Face API...');
    const response = await fetch(HUGGING_FACE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: message,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('API Response:', response.status, errorData);
      throw new Error(`Hugging Face API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    
    // Clean up the response text
    let responseText;
    try {
      if (Array.isArray(data)) {
        responseText = data[0]?.generated_text || data[0]?.toString() || 'I apologize, but I couldn\'t generate a response.';
      } else if (typeof data === 'object') {
        responseText = data.generated_text || JSON.stringify(data);
      } else if (typeof data === 'string') {
        responseText = data;
      } else {
        responseText = 'I apologize, but I couldn\'t generate a response.';
      }
    } catch (error) {
      console.error('Error processing response:', error);
      responseText = 'I apologize, but I encountered an error processing the response.';
    }

    // Clean up the response text
    responseText = responseText.toString().trim();
    
    res.json({ response: responseText });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: process.env.NODE_ENV === 'production' 
        ? 'An error occurred while processing your request.' 
        : error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    environment: process.env.NODE_ENV,
    endpoints: {
      health: '/health',
      chat: '/api/chat'
    },
    message: 'Portfolio backend server is running'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production'
      ? 'An internal server error occurred'
      : err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);
}); 