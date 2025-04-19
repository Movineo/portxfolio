import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
  text: string;
  isBot: boolean;
}

interface ChatBotProps {
  isDarkMode: boolean;
}

const ChatBot: React.FC<ChatBotProps> = ({ isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = message.trim();
    setMessage('');
    setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { text: data.response, isBot: true }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        text: 'Sorry, I encountered an error. Please try again.',
        isBot: true 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`${
              isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'
            } backdrop-blur-lg rounded-lg shadow-lg overflow-hidden
            w-[90vw] sm:w-[400px] h-[500px] max-h-[80vh]
            flex flex-col`}
          >
            {/* Header */}
            <div className={`
              p-4 ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'}
              flex items-center justify-between sticky top-0 z-10
            `}>
              <div className="flex items-center gap-2">
                <Bot className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                <h3 className="font-semibold">Portfolio Assistant</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className={`p-1 rounded-full hover:${
                  isDarkMode ? 'bg-gray-600/50' : 'bg-gray-200/50'
                }`}
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className={`
              flex-1 overflow-y-auto p-4 space-y-4
              ${isDarkMode ? 'scrollbar-dark' : 'scrollbar-light'}
            `}>
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-start gap-2 ${
                    msg.isBot ? '' : 'flex-row-reverse'
                  }`}
                >
                  <div className={`
                    flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                    ${msg.isBot 
                      ? isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100' 
                      : isDarkMode ? 'bg-green-500/20' : 'bg-green-100'
                    }
                  `}>
                    {msg.isBot ? <Bot size={16} /> : <User size={16} />}
                  </div>
                  <div className={`
                    rounded-lg p-3 max-w-[80%]
                    ${msg.isBot
                      ? isDarkMode 
                        ? 'bg-gray-700/50 text-white' 
                        : 'bg-gray-200/50 text-gray-800'
                      : isDarkMode
                        ? 'bg-blue-500/20 text-white'
                        : 'bg-blue-100 text-gray-800'
                    }
                  `}>
                    <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'}
                  `}>
                    <Bot size={16} />
                  </div>
                  <div className="flex gap-1">
                    <span className="animate-bounce delay-0">•</span>
                    <span className="animate-bounce delay-150">•</span>
                    <span className="animate-bounce delay-300">•</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form 
              onSubmit={handleSubmit}
              className={`
                p-4 border-t ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-200'
                }
              `}
            >
              <div className="flex gap-2">
                <textarea
                  ref={inputRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className={`
                    flex-1 resize-none rounded-lg p-2 max-h-32
                    ${isDarkMode 
                      ? 'bg-gray-700/50 text-white placeholder-gray-400' 
                      : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                    }
                    focus:outline-none focus:ring-2 ${
                      isDarkMode ? 'focus:ring-blue-500' : 'focus:ring-blue-600'
                    }
                  `}
                  rows={1}
                />
                <button
                  type="submit"
                  disabled={!message.trim() || isLoading}
                  className={`
                    p-2 rounded-lg transition-colors
                    ${isDarkMode ? 'bg-blue-500' : 'bg-blue-600'}
                    ${message.trim() && !isLoading 
                      ? 'opacity-100 hover:bg-blue-700' 
                      : 'opacity-50 cursor-not-allowed'
                    }
                  `}
                  aria-label="Send message"
                >
                  <Send size={20} className="text-white" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          p-4 rounded-full shadow-lg
          ${isDarkMode 
            ? 'bg-blue-500 hover:bg-blue-600' 
            : 'bg-blue-600 hover:bg-blue-700'
          }
          transition-colors
        `}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Toggle chat"
      >
        <MessageCircle size={24} className="text-white" />
      </motion.button>
    </div>
  );
};

export default ChatBot; 