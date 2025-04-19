import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Tag, X, ExternalLink } from 'lucide-react';
import LazyImage from './LazyImage';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  tags: string[];
  image: string;
  author: string;
}

interface BlogSectionProps {
  isDarkMode: boolean;
}

const samplePosts: BlogPost[] = [
  {
    id: '1',
    title: 'Building a Modern Portfolio with React and Three.js',
    excerpt: 'Learn how to create an interactive 3D portfolio using React, Three.js, and modern web technologies.',
    content: `
      Creating an engaging portfolio is crucial for developers to showcase their skills and projects. In this article, we'll explore how to build a modern portfolio using React and Three.js.

      ## Why React and Three.js?

      React provides a robust foundation for building interactive user interfaces, while Three.js enables stunning 3D visualizations. Combined, they create an immersive experience that helps your portfolio stand out.

      ## Key Features
      
      1. **Interactive 3D Background**
         - Particle system with mouse interaction
         - Smooth animations and transitions
         - Optimized performance
      
      2. **Responsive Design**
         - Mobile-first approach
         - Fluid layouts
         - Accessible interface
      
      3. **Modern Technologies**
         - React 18 with Hooks
         - Three.js for 3D graphics
         - Framer Motion for animations
         - TailwindCSS for styling

      ## Implementation Steps

      1. Set up your React project
      2. Install necessary dependencies
      3. Create the 3D background component
      4. Implement responsive layouts
      5. Add animations and interactions
      6. Optimize performance

      Stay tuned for more detailed tutorials on each aspect of building a modern portfolio!
    `,
    date: '2024-03-15',
    readTime: '5 min read',
    tags: ['React', 'Three.js', 'Web Development'],
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    author: 'Movine Odhiambo'
  },
  {
    id: '2',
    title: 'Optimizing React Performance with Memoization',
    excerpt: 'A deep dive into React memoization techniques and when to use them for optimal performance.',
    content: `
      Performance optimization is crucial for creating smooth user experiences in React applications. Let's explore how to effectively use memoization techniques.

      ## Understanding Memoization

      Memoization is an optimization technique that speeds up applications by storing the results of expensive computations and reusing them when the same inputs occur again.

      ## Key Concepts

      1. **React.memo**
         - When to use it
         - Performance benefits
         - Common pitfalls
      
      2. **useMemo Hook**
         - Memoizing computed values
         - Dependency arrays
         - Best practices
      
      3. **useCallback Hook**
         - Memoizing functions
         - Event handler optimization
         - Real-world examples

      ## Best Practices

      1. Don't over-optimize
      2. Measure performance gains
      3. Consider the trade-offs
      4. Profile your application

      Stay tuned for more performance optimization tips!
    `,
    date: '2024-03-10',
    readTime: '8 min read',
    tags: ['React', 'Performance', 'JavaScript'],
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    author: 'Movine Odhiambo'
  },
  {
    id: '3',
    title: 'Building Accessible Web Applications',
    excerpt: 'Best practices and techniques for creating web applications that are accessible to everyone.',
    content: `
      Web accessibility is not just a nice-to-have feature—it's a necessity. Let's explore how to make your web applications accessible to everyone.

      ## Why Accessibility Matters

      Creating accessible websites ensures that all users, regardless of their abilities, can access and interact with your content effectively.

      ## Key Areas

      1. **Semantic HTML**
         - Using proper heading structure
         - ARIA labels and roles
         - Meaningful alt text
      
      2. **Keyboard Navigation**
         - Focus management
         - Skip links
         - Keyboard shortcuts
      
      3. **Visual Considerations**
         - Color contrast
         - Text sizing
         - Visual indicators

      ## Implementation Guide

      1. Start with semantic HTML
      2. Implement keyboard navigation
      3. Add ARIA labels where needed
      4. Test with screen readers
      5. Validate accessibility

      Let's make the web accessible for everyone!
    `,
    date: '2024-03-05',
    readTime: '6 min read',
    tags: ['Accessibility', 'Web Development', 'UX'],
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    author: 'Movine Odhiambo'
  },
];

const BlogSection: React.FC<BlogSectionProps> = ({ isDarkMode }) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const openPost = (post: BlogPost) => {
    setSelectedPost(post);
    document.body.style.overflow = 'hidden';
  };

  const closePost = () => {
    setSelectedPost(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-3xl font-bold mb-12 text-center ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          Latest Blog Posts
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {samplePosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => openPost(post)}
              className={`rounded-lg overflow-hidden ${
                isDarkMode ? 'bg-gray-800/50' : 'bg-gray-100/80'
              } backdrop-blur-sm cursor-pointer transform transition-transform hover:scale-105`}
            >
              <div className="relative h-48">
                <LazyImage
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${
                  isDarkMode ? 'from-gray-900' : 'from-gray-800'
                } to-transparent opacity-60`} />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {post.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {post.readTime}
                    </span>
                  </div>
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {post.title}
                </h3>
                <p className={`mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {post.excerpt}
                </p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                        isDarkMode
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-blue-600/20 text-blue-700'
                      }`}
                    >
                      <Tag size={14} />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Blog Post Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto"
            onClick={closePost}
          >
            <div className="min-h-screen px-4 text-center">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
              
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className={`inline-block w-full max-w-4xl p-6 my-8 text-left align-middle rounded-lg shadow-xl transform transition-all ${
                  isDarkMode ? 'bg-gray-900' : 'bg-white'
                }`}
              >
                <div className="relative">
                  <button
                    onClick={closePost}
                    className={`absolute right-0 top-0 p-2 rounded-full ${
                      isDarkMode 
                        ? 'bg-gray-800 text-gray-400 hover:text-white'
                        : 'bg-gray-100 text-gray-600 hover:text-gray-900'
                    }`}
                    aria-label="Close modal"
                  >
                    <X size={20} />
                  </button>
                  
                  <div className="relative h-64 -mx-6 -mt-6 mb-6">
                    <LazyImage
                      src={selectedPost.image}
                      alt={selectedPost.title}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${
                      isDarkMode ? 'from-gray-900' : 'from-white'
                    } to-transparent opacity-60`} />
                  </div>

                  <div className="mb-6">
                    <h2 className={`text-3xl font-bold mb-4 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {selectedPost.title}
                    </h2>
                    
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Calendar size={16} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
                          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {selectedPost.date}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={16} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
                          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {selectedPost.readTime}
                          </span>
                        </div>
                      </div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        By {selectedPost.author}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {selectedPost.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                            isDarkMode
                              ? 'bg-blue-500/20 text-blue-300'
                              : 'bg-blue-600/20 text-blue-700'
                          }`}
                        >
                          <Tag size={14} />
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div 
                      className={`prose ${isDarkMode ? 'prose-invert' : ''} max-w-none`}
                      dangerouslySetInnerHTML={{ 
                        __html: selectedPost.content
                          .split('\n')
                          .map(line => {
                            if (line.trim().startsWith('##')) {
                              return `<h2 class="text-xl font-bold mt-6 mb-4">${line.replace('##', '').trim()}</h2>`;
                            }
                            if (line.trim().startsWith('#')) {
                              return `<h1 class="text-2xl font-bold mt-8 mb-4">${line.replace('#', '').trim()}</h1>`;
                            }
                            if (line.trim().startsWith('-')) {
                              return `<li class="ml-4">${line.replace('-', '').trim()}</li>`;
                            }
                            if (line.trim().startsWith('1.')) {
                              return `<div class="ml-4 mt-2">${line.trim()}</div>`;
                            }
                            return line ? `<p class="mb-4">${line.trim()}</p>` : '';
                          })
                          .join('')
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default BlogSection; 