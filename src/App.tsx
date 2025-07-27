import { useState, useEffect, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Mail, ChevronDown, Terminal, Database, Shield, Award, BookOpen, Briefcase, GraduationCap, Menu, X, Sun, Moon } from 'lucide-react';
import Background3D from './components/Background3D';
import AnimatedSection from './components/AnimatedSection';
import LazyImage from './components/LazyImage';
import SkillsProgress from './components/SkillsProgress';
import GitHubContributions from './components/GitHubContributions';
import ChatBot from './components/ChatBot';
import ContactForm from './components/ContactForm';

function App() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const sections = ['about', 'skills', 'projects', 'achievements', 'contact'];

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

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
      
      if (e.key === 'Tab' && !e.shiftKey) {
        const currentIndex = sections.indexOf(activeSection);
        if (currentIndex < sections.length - 1) {
          scrollToSection(sections[currentIndex + 1]);
        }
      }
      
      if (e.key === 'Tab' && e.shiftKey) {
        const currentIndex = sections.indexOf(activeSection);
        if (currentIndex > 0) {
          scrollToSection(sections[currentIndex - 1]);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);
    
    // Apply dark mode class on mount
    document.documentElement.classList.toggle('dark', isDarkMode);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeSection, isDarkMode]);

  const scrollToSection = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      setIsMobileMenuOpen(false);
      
      setTimeout(() => {
        element.focus();
        element.setAttribute('tabindex', '-1');
      }, 1000);
    }
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <>
      <Helmet>
        <title>Movine Odhiambo - Innovative Backend Developer</title>
        <meta name="description" content="Award-winning Backend Developer specializing in scalable APIs, databases, and secure server-side solutions with modern technologies." />
        <meta name="keywords" content="Movine Odhiambo, Backend Developer, Node.js, Express, Spring Boot, PostgreSQL, API, Security, Portfolio" />
        <meta property="og:title" content="Movine Odhiambo - Innovative Backend Developer" />
        <meta property="og:description" content="Award-winning Backend Developer crafting robust and secure server-side solutions" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://movine.xyz" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Helmet>

      <Background3D isDarkMode={isDarkMode} />

      <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900/90 to-black/90' : 'bg-gradient-to-br from-gray-50 to-white'} text-${isDarkMode ? 'white' : 'gray-900'} relative`}>
        {/* Navigation */}
        <nav className={`fixed top-0 left-0 right-0 ${isDarkMode ? 'bg-gray-900/80' : 'bg-white/80'} backdrop-blur-sm z-50`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button
                onClick={toggleMobileMenu}
                className={`md:hidden p-2 rounded-md ${isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-md ${isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
              >
                {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
              </button>

              <div className="hidden md:flex items-center space-x-8">
                {sections.map((section) => (
                  <motion.button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className={`text-sm font-medium transition-colors ${
                      activeSection === section 
                        ? isDarkMode ? 'text-blue-400' : 'text-blue-600'
                        : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    } hover:${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`Navigate to ${section} section`}
                    aria-current={activeSection === section ? 'page' : undefined}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`md:hidden fixed w-full ${isDarkMode ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-sm z-40`}
                id="mobile-menu"
                role="navigation"
                aria-label="Mobile menu"
              >
                <div className="px-4 py-2 space-y-2">
                  {sections.map((section) => (
                    <motion.button
                      key={section}
                      onClick={() => scrollToSection(section)}
                      className={`w-full text-left px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeSection === section 
                          ? isDarkMode ? 'text-blue-400 bg-blue-400/10' : 'text-blue-600 bg-blue-600/10'
                          : isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      whileTap={{ scale: 0.95 }}
                      aria-label={`Navigate to ${section} section`}
                      aria-current={activeSection === section ? 'page' : undefined}
                    >
                      {section.charAt(0).toUpperCase() + section.slice(1)}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        <div 
          ref={heroRef}
          id="about" 
          className={`min-h-screen flex items-center justify-center relative transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          style={{
            background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, ${
              isDarkMode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(37, 99, 235, 0.1)'
            }, transparent 50%)`
          }}
        >
          <AnimatedSection className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center mb-16">
              <motion.h1 
                className={`text-4xl sm:text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r ${
                  isDarkMode ? 'from-blue-400 to-purple-500' : 'from-blue-600 to-purple-600'
                } text-transparent bg-clip-text`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Movine Odhiambo
              </motion.h1>
              <motion.p 
                className={`text-lg sm:text-xl md:text-2xl ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-8 px-4`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Backend Developer | API Specialist | Security & Database Enthusiast
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
                  className={`hover:${isDarkMode ? 'text-blue-400' : 'text-blue-600'} transition-colors transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  aria-label="GitHub Profile"
                >
                  <Github size={24} />
                </a>
                <a 
                  href="https://www.linkedin.com/in/movine-odhiambo-5b4b5935a" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`hover:${isDarkMode ? 'text-blue-400' : 'text-blue-600'} transition-colors transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin size={24} />
                </a>
                <a 
                  href="mailto:movineee@gmail.com" 
                  className={`hover:${isDarkMode ? 'text-blue-400' : 'text-blue-600'} transition-colors transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  aria-label="Email Contact"
                >
                  <Mail size={24} />
                </a>
              </motion.div>
            </div>

            <AnimatedSection className="mb-20">
              <div className={`${isDarkMode ? 'bg-gray-900/30' : 'bg-white/80'} p-4 sm:p-8 rounded-lg backdrop-blur-sm shadow-xl`}>
                <div className="flex items-center mb-6">
                  <GraduationCap className={`w-8 h-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} mr-4`} />
                  <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Education</h2>
                </div>
                <div className="ml-0 sm:ml-12">
                  <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>B.Sc. Mathematics & Computer Science</h3>
                  <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Jomo Kenyatta University of Agriculture and Technology</p>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-2`}>Relevant Coursework:</p>
                  <ul className={`list-disc list-inside ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} ml-4`}>
                    <li>Data Structures & Algorithms</li>
                    <li>Database Systems</li>
                    <li>Web Development</li>
                  </ul>
                </div>
              </div>
            </AnimatedSection>

            <div id="skills" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 mb-20">
              {[ 
                {
                  icon: <Terminal className={`w-12 h-12 mb-4 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />,
                  title: "Backend",
                  skills: ["Node.js", "Express.js", "Spring Boot", "REST APIs", "GraphQL"]
                },
                {
                  icon: <Database className={`w-12 h-12 mb-4 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />,
                  title: "Database",
                  skills: ["PostgreSQL", "MySQL", "MongoDB", "ORM Patterns", "Prisma"]
                },
                {
                  icon: <Shield className={`w-12 h-12 mb-4 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />,
                  title: "Security",
                  skills: ["JWT Auth", "OAuth2", "Role-Based Access", "OWASP", "HTTPS"]
                }
              ].map((skill) => (
                <AnimatedSection key={skill.title}>
                  <motion.div
                    className={`${isDarkMode ? 'bg-gray-900/30' : 'bg-white/80'} p-4 sm:p-6 rounded-lg backdrop-blur-sm hover:transform hover:-translate-y-2 transition-all shadow-xl`}
                    whileHover={{ scale: 1.05 }}
                    tabIndex={0}
                    aria-label={skill.title + ' skills'}
                  >
                    {skill.icon}
                    <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{skill.title}</h3>
                    <ul className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      {skill.skills.map((s) => (
                        <li key={s} className="list-disc list-inside ml-4">{s}</li>
                      ))}
                    </ul>
                  </motion.div>
                </AnimatedSection>
              ))}
              <SkillsProgress isDarkMode={isDarkMode} />
            </div>

            <div id="github" className="mb-20">
              <GitHubContributions isDarkMode={isDarkMode} username="Movineo" />
            </div>

            <div id="achievements" className="mb-20">
              <h2 className={`text-3xl font-bold mb-8 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Achievements</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: <Award className={`w-12 h-12 mb-4 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />,
                    title: "Top 10% in University",
                    description: "Ranked in programming competitions (2023)"
                  },
                  {
                    icon: <BookOpen className={`w-12 h-12 mb-4 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />,
                    title: "50+ Training Hours",
                    description: "Specialized backend development training"
                  },
                  {
                    icon: <Briefcase className={`w-12 h-12 mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />,
                    title: "100% Success Rate",
                    description: "Perfect code review approval rate"
                  }
                ].map((achievement) => (
                  <AnimatedSection key={achievement.title}>
                    <motion.div
                      className={`${isDarkMode ? 'bg-gray-900/30' : 'bg-white/80'} p-6 rounded-lg backdrop-blur-sm shadow-xl`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {achievement.icon}
                      <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{achievement.title}</h3>
                      <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{achievement.description}</p>
                    </motion.div>
                  </AnimatedSection>
                ))}
              </div>
            </div>

            <div id="projects" className="mb-20">
              <h2 className={`text-3xl font-bold mb-12 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Featured Projects</h2>
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
                ].map((project) => (
                  <AnimatedSection key={project.title}>
                    <motion.div
                      className={`${isDarkMode ? 'bg-gray-900/30' : 'bg-white/80'} rounded-lg overflow-hidden group shadow-xl`}
                      whileHover={{ y: -8 }}
                      tabIndex={0}
                      role="article"
                      aria-label={`Project: ${project.title}`}
                    >
                      <div className="relative">
                        <LazyImage
                          src={project.image}
                          alt={project.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t ${
                          isDarkMode ? 'from-gray-900' : 'from-gray-800'
                        } to-transparent opacity-60`}></div>
                      </div>
                      <div className="p-6">
                        <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{project.title}</h3>
                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>{project.description}</p>
                        <div className="flex gap-2">
                          {project.tags.map(tag => (
                            <span 
                              key={tag} 
                              className={`px-3 py-1 ${
                                isDarkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-600/20 text-blue-700'
                              } rounded-full text-sm`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </AnimatedSection>
                ))}
              </div>
            </div>

            <AnimatedSection id="contact" className="text-center">
              <h2 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Let's Connect</h2>
              <ContactForm isDarkMode={isDarkMode} />
            </AnimatedSection>

            <motion.div 
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ChevronDown className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} size={24} />
            </motion.div>
          </AnimatedSection>
        </div>

        <ChatBot isDarkMode={isDarkMode} />
      </div>
    </>
  );
}

export default App;