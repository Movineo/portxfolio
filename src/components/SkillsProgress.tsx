import React from 'react';
import { motion } from 'framer-motion';
import { Database, Server, Shield, Terminal } from 'lucide-react';

interface Skill {
  name: string;
  level: number;
  icon: JSX.Element;
  color: string;
}

interface SkillsProgressProps {
  isDarkMode: boolean;
}

const SkillsProgress: React.FC<SkillsProgressProps> = ({ isDarkMode }) => {
  const skills: Skill[] = [
    {
      name: 'Backend Development',
      level: 85,
      icon: <Server className="w-5 h-5" />,
      color: 'green'
    },
    {
      name: 'Database Management',
      level: 80,
      icon: <Database className="w-5 h-5" />,
      color: 'purple'
    },
    {
      name: 'Security & Authentication',
      level: 75,
      icon: <Shield className="w-5 h-5" />,
      color: 'red'
    },
    {
      name: 'DevOps & Deployment',
      level: 70,
      icon: <Terminal className="w-5 h-5" />,
      color: 'yellow'
    }
  ];

  const getColorClass = (color: string, isDark: boolean) => {
    const colorMap = {
      blue: isDark ? 'bg-blue-500' : 'bg-blue-600',
      green: isDark ? 'bg-green-500' : 'bg-green-600',
      purple: isDark ? 'bg-purple-500' : 'bg-purple-600',
      red: isDark ? 'bg-red-500' : 'bg-red-600',
      pink: isDark ? 'bg-pink-500' : 'bg-pink-600',
      yellow: isDark ? 'bg-yellow-500' : 'bg-yellow-600'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const getTextColorClass = (color: string, isDark: boolean) => {
    const colorMap = {
      blue: isDark ? 'text-blue-400' : 'text-blue-600',
      green: isDark ? 'text-green-400' : 'text-green-600',
      purple: isDark ? 'text-purple-400' : 'text-purple-600',
      red: isDark ? 'text-red-400' : 'text-red-600',
      pink: isDark ? 'text-pink-400' : 'text-pink-600',
      yellow: isDark ? 'text-yellow-400' : 'text-yellow-600'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="col-span-full">
      <h3 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Skills & Expertise
      </h3>
      <div className="grid gap-6">
        {skills.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-100/80'}`}
          >
            <div className="flex items-center gap-4 mb-2">
              <div className={`${getTextColorClass(skill.color, isDarkMode)}`}>
                {skill.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {skill.name}
                  </h4>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {skill.level}%
                  </span>
                </div>
                <div className={`h-2 rounded-full mt-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <motion.div
                    className={`h-full rounded-full ${getColorClass(skill.color, isDarkMode)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SkillsProgress; 