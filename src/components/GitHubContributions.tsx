import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Calendar, Star, GitFork } from 'lucide-react';

interface Contribution {
  date: string;
  count: number;
}

interface Repository {
  name: string;
  description: string;
  stars: number;
  forks: number;
  url: string;
}

interface GitHubContributionsProps {
  isDarkMode: boolean;
  username: string;
}

const GitHubContributions: React.FC<GitHubContributionsProps> = ({ isDarkMode, username }) => {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalContributions: 0,
    streak: 0,
    repositories: 0,
  });

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch user's repositories
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=3`);
        if (!reposResponse.ok) throw new Error('Failed to fetch repositories');
        const reposData = await reposResponse.json();
        
        const topRepos = reposData.map((repo: any) => ({
          name: repo.name,
          description: repo.description,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          url: repo.html_url,
        }));

        // Fetch the last year of contributions
        const eventsResponse = await fetch(`https://api.github.com/users/${username}/events/public`);
        if (!eventsResponse.ok) {
          throw new Error('Failed to fetch GitHub contributions');
        }

        const events = await eventsResponse.json();
        
        // Process events to count contributions
        const contributionMap = new Map<string, number>();
        const today = new Date();
        const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

        // Initialize all dates in the last year with 0 contributions
        for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
          contributionMap.set(d.toISOString().split('T')[0], 0);
        }

        // Count contributions from events
        events.forEach((event: any) => {
          const date = event.created_at.split('T')[0];
          if (new Date(date) >= oneYearAgo) {
            const currentCount = contributionMap.get(date) || 0;
            contributionMap.set(date, currentCount + 1);
          }
        });

        // Convert map to array and sort by date
        const contributionsArray = Array.from(contributionMap.entries())
          .map(([date, count]) => ({ date, count }))
          .sort((a, b) => a.date.localeCompare(b.date));

        // Calculate stats
        const totalContributions = contributionsArray.reduce((sum, day) => sum + day.count, 0);
        let currentStreak = 0;
        let maxStreak = 0;
        
        for (let i = contributionsArray.length - 1; i >= 0; i--) {
          if (contributionsArray[i].count > 0) {
            currentStreak++;
            maxStreak = Math.max(maxStreak, currentStreak);
          } else {
            break;
          }
        }

        setContributions(contributionsArray);
        setRepositories(topRepos);
        setStats({
          totalContributions,
          streak: maxStreak,
          repositories: reposData.length,
        });
      } catch (err) {
        console.error('Error fetching GitHub data:', err);
        setError('Failed to load GitHub data');
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      fetchGitHubData();
    }
  }, [username]);

  const getContributionColor = (count: number): string => {
    if (isDarkMode) {
      if (count === 0) return 'bg-gray-800';
      if (count <= 2) return 'bg-green-900';
      if (count <= 4) return 'bg-green-700';
      if (count <= 6) return 'bg-green-500';
      return 'bg-green-300';
    } else {
      if (count === 0) return 'bg-gray-100';
      if (count <= 2) return 'bg-green-200';
      if (count <= 4) return 'bg-green-400';
      if (count <= 6) return 'bg-green-600';
      return 'bg-green-800';
    }
  };

  if (isLoading) {
    return (
      <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800/30' : 'bg-gray-100/80'} backdrop-blur-sm`}>
        <div className="flex items-center justify-center space-x-2">
          <Github className="animate-spin" />
          <span>Loading contributions...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800/30' : 'bg-gray-100/80'} backdrop-blur-sm`}>
        <div className="flex items-center justify-center space-x-2 text-red-500">
          <Github />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800/30' : 'bg-gray-100/80'} backdrop-blur-sm`}
    >
      <div className="flex items-center gap-2 mb-6">
        <Github className={isDarkMode ? 'text-white' : 'text-gray-900'} size={24} />
        <h3 className={`text-xl font-semibold ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          GitHub Activity
        </h3>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className={`p-4 rounded-lg ${
          isDarkMode ? 'bg-gray-700/50' : 'bg-gray-200/50'
        }`}>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Contributions
          </p>
          <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {stats.totalContributions}
          </p>
        </div>
        <div className={`p-4 rounded-lg ${
          isDarkMode ? 'bg-gray-700/50' : 'bg-gray-200/50'
        }`}>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Streak
          </p>
          <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {stats.streak} days
          </p>
        </div>
        <div className={`p-4 rounded-lg ${
          isDarkMode ? 'bg-gray-700/50' : 'bg-gray-200/50'
        }`}>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Repositories
          </p>
          <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {stats.repositories}
          </p>
        </div>
      </div>

      {/* Contribution Graph */}
      <div className="mb-6">
        <div className="overflow-x-auto">
          <div className="grid grid-cols-52 gap-1">
            {contributions.map((contribution, index) => (
              <motion.div
                key={contribution.date}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.005 }}
                className={`w-3 h-3 rounded-sm ${getContributionColor(contribution.count)}`}
                title={`${contribution.count} contributions on ${contribution.date}`}
              />
            ))}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-end gap-2">
          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Less</span>
          {[0, 2, 4, 6, 8].map((count) => (
            <div
              key={count}
              className={`w-3 h-3 rounded-sm ${getContributionColor(count)}`}
            />
          ))}
          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>More</span>
        </div>
      </div>

      {/* Top Repositories */}
      <div className="space-y-4">
        <h4 className={`text-lg font-semibold ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Top Repositories
        </h4>
        {repositories.map((repo) => (
          <motion.a
            key={repo.name}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`block p-4 rounded-lg ${
              isDarkMode ? 'bg-gray-700/50 hover:bg-gray-600/50' : 'bg-gray-200/50 hover:bg-gray-300/50'
            } transition-colors`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <h5 className={`font-medium mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {repo.name}
            </h5>
            <p className={`text-sm mb-3 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {repo.description || 'No description available'}
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star size={14} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {repo.stars}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <GitFork size={14} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {repo.forks}
                </span>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
};

export default GitHubContributions; 