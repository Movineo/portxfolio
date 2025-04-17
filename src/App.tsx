import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, ExternalLink, ChevronDown, Code2, Terminal, Database, Shield, Award, BookOpen, Briefcase, GraduationCap } from 'lucide-react';
import Background3D from './components/Background3D';
import AnimatedSection from './components/AnimatedSection';

function App() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
    
    const imageUrls = [
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80'
    ];
    
    imageUrls.forEach(url => {
      const img = new Image();
      img.src = url;
    });

    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const { left, top, width, height } = heroRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Movine Odhiambo - Innovative Full-Stack Developer</title>
        <meta name="description" content="Award-winning Full-Stack Developer specializing in creating cutting-edge web applications with modern technologies and exceptional user experiences." />
        <meta name="keywords" content="Movine Odhiambo, Full-Stack Developer, React, Node.js, Three.js, Web Development, Portfolio" />
        <meta property="og:title" content="Movine Odhiambo - Innovative Full-Stack Developer" />
        <meta property="og:description" content="Award-winning Full-Stack Developer crafting next-generation web experiences" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://movine.xyz" />
      </Helmet>

      <Background3D />

      <div className="min-h-screen bg-gradient-to-br from-gray-900/90 to-black/90 text-white relative">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-16 space-x-8">
              {['about', 'skills', 'projects', 'achievements', 'contact'].map((section) => (
                <motion.button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`text-sm font-medium transition-colors hover:text-blue-400 ${
                    activeSection === section ? 'text-blue-400' : 'text-gray-300'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`Navigate to ${section} section`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </motion.button>
              ))}
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div 
          ref={heroRef}
          id="about" 
          className={`min-h-screen flex items-center justify-center relative transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          style={{
            background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(59, 130, 246, 0.15), transparent 50%)`
          }}
        >
          <AnimatedSection className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center mb-16">
              <motion.h1 
                className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Movine Odhiambo
              </motion.h1>
              <motion.p 
                className="text-xl md:text-2xl text-gray-300 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Full-Stack Developer | Problem Solver | Innovation Enthusiast
              </motion.p>
              <motion.div 
                className="flex justify-center gap-6 mb-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <a 
                  href="https://github.com/Movineo" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-blue-400 transition-colors transform hover:scale-110"
                  aria-label="GitHub Profile"
                >
                  <Github size={24} />
                </a>
                <a 
                  href="https://linkedin.com/in/movine-odhiambo" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-blue-400 transition-colors transform hover:scale-110"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin size={24} />
                </a>
                <a 
                  href="mailto:movineee@gmail.com" 
                  className="hover:text-blue-400 transition-colors transform hover:scale-110"
                  aria-label="Email Contact"
                >
                  <Mail size={24} />
                </a>
              </motion.div>
            </div>

            {/* Rest of the sections with AnimatedSection wrapper */}
            {/* Education Section */}
            <AnimatedSection className="mb-20">
              <div className="bg-gray-800/30 p-8 rounded-lg backdrop-blur-sm">
                <div className="flex items-center mb-6">
                  <GraduationCap className="w-8 h-8 text-blue-400 mr-4" />
                  <h2 className="text-2xl font-bold">Education</h2>
                </div>
                <div className="ml-12">
                  <h3 className="text-xl font-semibold text-blue-400">B.Sc. Mathematics & Computer Science</h3>
                  <p className="text-gray-300">Jomo Kenyatta University of Agriculture and Technology</p>
                  <p className="text-gray-400 mt-2">Relevant Coursework:</p>
                  <ul className="list-disc list-inside text-gray-400 ml-4">
                    <li>Data Structures & Algorithms</li>
                    <li>Database Systems</li>
                    <li>Web Development</li>
                  </ul>
                </div>
              </div>
            </AnimatedSection>

            {/* Skills Section */}
            <div id="skills" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
              {[
                {
                  icon: <Code2 className="w-12 h-12 mb-4 text-blue-400" />,
                  title: "Frontend",
                  skills: "HTML5, CSS3, JavaScript (ES6+), React"
                },
                {
                  icon: <Terminal className="w-12 h-12 mb-4 text-purple-400" />,
                  title: "Backend",
                  skills: "Node.js, Express.js, Spring Boot"
                },
                {
                  icon: <Database className="w-12 h-12 mb-4 text-green-400" />,
                  title: "Database",
                  skills: "PostgreSQL, MySQL, ORM Patterns"
                },
                {
                  icon: <Shield className="w-12 h-12 mb-4 text-red-400" />,
                  title: "Security",
                  skills: "JWT Auth, Role-Based Access"
                }
              ].map((skill, index) => (
                <AnimatedSection key={skill.title}>
                  <motion.div
                    className="bg-gray-800/50 p-6 rounded-lg backdrop-blur-sm hover:transform hover:-translate-y-2 transition-all"
                    whileHover={{ scale: 1.05 }}
                  >
                    {skill.icon}
                    <h3 className="text-xl font-semibold mb-2">{skill.title}</h3>
                    <p className="text-gray-400">{skill.skills}</p>
                  </motion.div>
                </AnimatedSection>
              ))}
            </div>

            {/* Achievements Section */}
            <div id="achievements" className="mb-20">
              <h2 className="text-3xl font-bold mb-8 text-center">Achievements</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: <Award className="w-12 h-12 mb-4 text-yellow-400" />,
                    title: "Top 10% in University",
                    description: "Ranked in programming competitions (2023)"
                  },
                  {
                    icon: <BookOpen className="w-12 h-12 mb-4 text-green-400" />,
                    title: "50+ Training Hours",
                    description: "Specialized backend development training"
                  },
                  {
                    icon: <Briefcase className="w-12 h-12 mb-4 text-blue-400" />,
                    title: "100% Success Rate",
                    description: "Perfect code review approval rate"
                  }
                ].map((achievement, index) => (
                  <AnimatedSection key={achievement.title}>
                    <motion.div
                      className="bg-gray-800/30 p-6 rounded-lg backdrop-blur-sm"
                      whileHover={{ scale: 1.05 }}
                    >
                      {achievement.icon}
                      <h3 className="text-xl font-semibold mb-2">{achievement.title}</h3>
                      <p className="text-gray-400">{achievement.description}</p>
                    </motion.div>
                  </AnimatedSection>
                ))}
              </div>
            </div>

            {/* Projects Section */}
            <div id="projects" className="mb-20">
              <h2 className="text-3xl font-bold mb-12 text-center">Featured Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  {
                    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80",
                    title: "Event Management System",
                    description: "Full-stack platform handling 1,000+ registrations with QR ticketing system.",
                    tags: ["Node.js", "PostgreSQL"]
                  },
                  {
                    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
                    title: "Developer Portfolio Platform",
                    description: "Responsive portfolio with GitHub API integration and 95+ accessibility score.",
                    tags: ["React", "JavaScript"]
                  }
                ].map((project, index) => (
                  <AnimatedSection key={project.title}>
                    <motion.div
                      className="bg-gray-800/30 rounded-lg overflow-hidden group"
                      whileHover={{ y: -8 }}
                    >
                      <div className="relative">
                        <img 
                          src={project.image}
                          alt={project.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                        <p className="text-gray-400 mb-4">{project.description}</p>
                        <div className="flex gap-2">
                          {project.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </AnimatedSection>
                ))}
              </div>
            </div>

            {/* Contact Section */}
            <AnimatedSection id="contact" className="text-center">
              <h2 className="text-3xl font-bold mb-8">Let's Connect</h2>
              <p className="text-xl text-gray-300 mb-8">
                Currently open to new opportunities and collaborations
              </p>
              <motion.a 
                href="mailto:movineee@gmail.com"
                className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Send email to Movine"
              >
                Get in Touch
                <ExternalLink size={20} />
              </motion.a>
            </AnimatedSection>

            <motion.div 
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ChevronDown size={24} className="text-gray-400" />
            </motion.div>
          </AnimatedSection>
        </div>
      </div>
    </>
  );
}

export default App;