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

        // Headers for GitHub API requests
        const headers = {
          'Accept': 'application/vnd.github.v3+json',
          ...(import.meta.env.VITE_GITHUB_TOKEN && {
            'Authorization': `token ${import.meta.env.VITE_GITHUB_TOKEN}`
          })
        };

        // Fetch user's repositories
        const reposResponse = await fetch(
          `https://api.github.com/users/${username}/repos?sort=updated&per_page=10`,
          { headers }
        );
        
        if (!reposResponse.ok) {
          throw new Error('Failed to fetch repositories');
        }
        
        const reposData = await reposResponse.json();
        
        // Sort repositories by stars and get top 3
        const topRepos = reposData
          .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
          .slice(0, 3)
          .map((repo: any) => ({
            name: repo.name,
            description: repo.description,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            url: repo.html_url,
          }));

        // Fetch user's events (commits, PRs, issues)
        const eventsResponse = await fetch(
          `https://api.github.com/users/${username}/events?per_page=100`,
          { headers }
        );
        
        if (!eventsResponse.ok) {
          throw new Error('Failed to fetch GitHub events');
        }

        const events = await eventsResponse.json();
        
        // Initialize contribution map for the last year
        const contributionMap = new Map<string, number>();
        const today = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(today.getFullYear() - 1);

        // Initialize all dates with 0 contributions
        for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
          contributionMap.set(d.toISOString().split('T')[0], 0);
        }

        // Count contributions from different event types
        events.forEach((event: any) => {
          const date = event.created_at.split('T')[0];
          if (new Date(date) >= oneYearAgo) {
            let count = 0;
            switch (event.type) {
              case 'PushEvent':
                count = event.payload.commits?.length || 0;
                break;
              case 'PullRequestEvent':
              case 'IssuesEvent':
              case 'CreateEvent':
                count = 1;
                break;
              default:
                count = 0;
            }
            const currentCount = contributionMap.get(date) || 0;
            contributionMap.set(date, currentCount + count);
          }
        });

        // Convert map to array and sort by date
        const contributionsArray = Array.from(contributionMap.entries())
          .map(([date, count]) => ({ date, count }))
          .sort((a, b) => a.date.localeCompare(b.date));

        // Calculate stats
        const totalContributions = contributionsArray.reduce((sum, day) => sum + day.count, 0);
        
        // Calculate current streak
        let currentStreak = 0;
        const today_str = new Date().toISOString().split('T')[0];
        
        for (let i = contributionsArray.length - 1; i >= 0; i--) {
          const contribution = contributionsArray[i];
          if (contribution.date > today_str) continue;
          if (contribution.count > 0) {
            currentStreak++;
          } else {
            break;
          }
        }

        setContributions(contributionsArray);
        setRepositories(topRepos);
        setStats({
          totalContributions,
          streak: currentStreak,
          repositories: reposData.length,
        });
      } catch (err) {
        console.error('Error fetching GitHub data:', err);
        setError('Failed to load GitHub data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      fetchGitHubData();
    }
  }, [username]);

  const getContributionColor = (count: number) => {
    if (isDarkMode) {
      if (count === 0) return 'bg-gray-800';
      if (count <= 2) return 'bg-green-900';
      if (count <= 5) return 'bg-green-700';
      if (count <= 10) return 'bg-green-500';
      return 'bg-green-300';
    } else {
      if (count === 0) return 'bg-gray-100';
      if (count <= 2) return 'bg-green-200';
      if (count <= 5) return 'bg-green-400';
      if (count <= 10) return 'bg-green-600';
      return 'bg-green-800';
    }
  };

  if (isLoading) {
    return (
      <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800/30' : 'bg-gray-100/80'} backdrop-blur-sm`}>
        <div className="flex items-center justify-center space-x-2">
          <Github className="animate-spin" />
          <span>Loading GitHub activity...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800/30' : 'bg-gray-100/80'} backdrop-blur-sm`}>
        <div className="text-red-500 flex items-center justify-center space-x-2">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800/30' : 'bg-gray-100/80'} backdrop-blur-sm`}>
      <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        <Github className="w-6 h-6" />
        GitHub Activity
      </h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-200/80'}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5" />
            <h3 className="font-semibold">Contributions</h3>
          </div>
          <p className="text-2xl font-bold">{stats.totalContributions}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-200/80'}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5" />
            <h3 className="font-semibold">Streak</h3>
          </div>
          <p className="text-2xl font-bold">{stats.streak} days</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-200/80'}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Github className="w-5 h-5" />
            <h3 className="font-semibold">Repositories</h3>
          </div>
          <p className="text-2xl font-bold">{stats.repositories}</p>
        </motion.div>
      </div>

      {/* Contribution Graph */}
      <div className="mb-8">
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Contribution Activity
        </h3>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 7 }, (_, i) => (
            <div key={i} className="w-3 h-3"></div>
          ))}
          {contributions.map((day, index) => (
            <motion.div
              key={day.date}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.001 }}
              className={`w-3 h-3 rounded-sm ${getContributionColor(day.count)}`}
              title={`${day.date}: ${day.count} contributions`}
            />
          ))}
        </div>
        <div className="flex items-center justify-end mt-2 text-sm">
          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Less</span>
          <div className="flex gap-1 mx-2">
            {[0, 2, 5, 10, 15].map((count) => (
              <div
                key={count}
                className={`w-3 h-3 rounded-sm ${getContributionColor(count)}`}
              />
            ))}
          </div>
          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>More</span>
        </div>
      </div>

      {/* Top Repositories */}
      <div>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Top Repositories
        </h3>
        <div className="space-y-4">
          {repositories.map((repo) => (
            <motion.a
              key={repo.name}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`block p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-700/30 hover:bg-gray-700/50' : 'bg-gray-200/80 hover:bg-gray-300/80'
              } transition-colors`}
              whileHover={{ scale: 1.02 }}
            >
              <h4 className="font-semibold mb-2">{repo.name}</h4>
              <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {repo.description || 'No description available'}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  <span className="text-sm">{repo.stars}</span>
                </div>
                <div className="flex items-center gap-1">
                  <GitFork className="w-4 h-4" />
                  <span className="text-sm">{repo.forks}</span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GitHubContributions; 