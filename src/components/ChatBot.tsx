import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatBotProps {
  isDarkMode: boolean;
}

const ChatBot: React.FC<ChatBotProps> = ({ isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm Movine's portfolio assistant. I can help you learn about:\n\n" +
            "• Skills & Technologies\n" +
            "• Projects & Work Experience\n" +
            "• Education & Background\n" +
            "• Contact Information\n\n" +
            "What would you like to know?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputValue.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from server');
      }

      const data = await response.json();
      
      // Ensure we have a clean string response
      let botResponse: string;
      try {
        if (typeof data.response === 'string') {
          botResponse = data.response.trim();
        } else if (data.response && typeof data.response === 'object') {
          botResponse = 'I apologize, but I received an unexpected response format.';
        } else {
          botResponse = 'I apologize, but I couldn\'t understand that.';
        }
      } catch (error) {
        console.error('Error processing bot response:', error);
        botResponse = 'I apologize, but I encountered an error processing the response.';
      }
      
      // Add bot message
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again later.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Add suggested queries
  const suggestedQueries = [
    "What are your technical skills?",
    "Tell me about your projects",
    "How can I contact you?",
    "What's your background?",
  ];

  const handleSuggestedQuery = (query: string) => {
    if (isLoading) return;
    setInputValue(query);
    handleSubmit({ preventDefault: () => {} } as React.FormEvent);
  };

  return (
    <>
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 p-4 rounded-full ${
          isDarkMode ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'
        } text-white shadow-lg z-50 transition-colors duration-200`}
        aria-label="Open chat"
      >
        <MessageSquare size={24} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className={`fixed bottom-24 right-8 w-96 rounded-lg shadow-xl flex flex-col ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } z-50 overflow-hidden`}
            style={{
              maxHeight: 'calc(100vh - 120px)',
              minHeight: '400px',
              top: 'auto'
            }}
          >
            {/* Header */}
            <div className={`p-4 flex items-center justify-between border-b ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            } bg-opacity-95 backdrop-blur-sm sticky top-0 z-10`}>
              <div className="flex items-center gap-2">
                <Bot className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} size={20} />
                <span className={`font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Portfolio Assistant
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className={`p-2 rounded-full hover:bg-opacity-80 transition-colors duration-200 ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
                aria-label="Close chat"
              >
                <X size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
              </button>
            </div>

            {/* Messages Container */}
            <div 
              className={`flex-1 overflow-y-auto p-4 space-y-4 ${
                isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
              }`}
              style={{ maxHeight: 'calc(100vh - 240px)' }}
            >
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.sender === 'bot' && (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isDarkMode ? 'bg-blue-500' : 'bg-blue-600'
                    }`}>
                      <Bot size={16} className="text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg p-3 whitespace-pre-wrap ${
                      message.sender === 'user'
                        ? isDarkMode
                          ? 'bg-blue-500 text-white'
                          : 'bg-blue-600 text-white'
                        : isDarkMode
                        ? 'bg-gray-700 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    {message.text}
                  </div>
                  {message.sender === 'user' && (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      <User size={16} className={isDarkMode ? 'text-white' : 'text-gray-900'} />
                    </div>
                  )}
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start gap-2"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isDarkMode ? 'bg-blue-500' : 'bg-blue-600'
                  }`}>
                    <Bot size={16} className="text-white" />
                  </div>
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <Loader2 className={`animate-spin ${isDarkMode ? 'text-white' : 'text-gray-900'}`} size={16} />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Queries */}
            {messages.length === 1 && (
              <div className={`p-4 border-t ${
                isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
              }`}>
                <div className="flex flex-wrap gap-2">
                  {suggestedQueries.map((query) => (
                    <button
                      key={query}
                      onClick={() => handleSuggestedQuery(query)}
                      disabled={isLoading}
                      className={`px-3 py-1 rounded-full text-sm ${
                        isDarkMode
                          ? 'bg-gray-700 hover:bg-gray-600 text-white'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                      } transition-colors duration-200`}
                    >
                      {query}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className={`p-4 border-t ${
              isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
            } sticky bottom-0`}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className={`flex-1 px-4 py-2 rounded-lg ${
                    isDarkMode
                      ? 'bg-gray-700 text-white placeholder-gray-400'
                      : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
                  disabled={isLoading}
                />
                <button
                  onClick={handleSubmit}
                  disabled={!inputValue.trim() || isLoading}
                  className={`p-2 rounded-lg ${
                    isDarkMode ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'
                  } text-white disabled:opacity-50 transition-colors duration-200`}
                  aria-label="Send message"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <Send size={20} />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot; 