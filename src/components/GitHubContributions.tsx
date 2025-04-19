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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalContributions: 0,
    streak: 0,
    repositories: 0,
  });

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        setLoading(true);
        
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

        // Fetch user's events (contributions)
        const eventsResponse = await fetch(`https://api.github.com/users/${username}/events/public`);
        if (!eventsResponse.ok) throw new Error('Failed to fetch contributions');
        const eventsData = await eventsResponse.json();

        // Process events into daily contributions
        const contributionMap = new Map<string, number>();
        const today = new Date();
        const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Initialize all days with 0 contributions
        for (let d = new Date(thirtyDaysAgo); d <= today; d.setDate(d.getDate() + 1)) {
          contributionMap.set(d.toISOString().split('T')[0], 0);
        }

        // Count contributions from events
        eventsData.forEach((event: any) => {
          const date = event.created_at.split('T')[0];
          if (contributionMap.has(date)) {
            contributionMap.set(date, (contributionMap.get(date) || 0) + 1);
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
        setLoading(false);
        setError(null);
      } catch (err) {
        console.error('Error fetching GitHub data:', err);
        setError('Failed to load GitHub data');
        setLoading(false);
      }
    };

    if (username) {
      fetchGitHubData();
    }
  }, [username]);

  const getContributionColor = (count: number) => {
    if (count === 0) return isDarkMode ? 'bg-gray-800' : 'bg-gray-100';
    if (count < 3) return isDarkMode ? 'bg-green-900/70' : 'bg-green-100';
    if (count < 6) return isDarkMode ? 'bg-green-700/70' : 'bg-green-300';
    if (count < 9) return isDarkMode ? 'bg-green-500/70' : 'bg-green-500';
    return isDarkMode ? 'bg-green-300/70' : 'bg-green-700';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center p-4 rounded-lg ${
        isDarkMode ? 'bg-gray-800/50' : 'bg-gray-100/80'
      }`}>
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-lg ${
        isDarkMode ? 'bg-gray-800/50' : 'bg-gray-100/80'
      } backdrop-blur-sm`}
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
        <div className="grid grid-cols-7 gap-1">
          {contributions.map((contribution, index) => (
            <motion.div
              key={contribution.date}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02 }}
              className={`aspect-square rounded-sm ${getContributionColor(contribution.count)} hover:ring-2 hover:ring-blue-500 transition-all cursor-help`}
              title={`${contribution.count} contributions on ${new Date(contribution.date).toLocaleDateString()}`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between mt-4 text-sm">
          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Less
          </span>
          <div className="flex gap-1">
            {[0, 3, 6, 9].map((count) => (
              <div
                key={count}
                className={`w-3 h-3 rounded-sm ${getContributionColor(count)}`}
              />
            ))}
          </div>
          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            More
          </span>
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