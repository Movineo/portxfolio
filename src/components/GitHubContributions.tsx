import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Calendar, Star, GitFork, Code, GitPullRequest, AlertCircle } from 'lucide-react';

interface Contribution {
  date: string;
  count: number;
  types: { [key: string]: number };
}

interface Repository {
  name: string;
  description: string;
  stars: number;
  forks: number;
  url: string;
  language: string;
}

interface GitHubContributionsProps {
  isDarkMode: boolean;
  username: string;
}

const CACHE_KEY = 'github_contributions_cache';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

const GitHubContributions: React.FC<GitHubContributionsProps> = ({ isDarkMode, username }) => {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalContributions: 0,
    streak: 0,
    repositories: 0,
    maxContributions: 0,
  });
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchGitHubData = async (retryCount = 0) => {
      // Check cache first
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const { timestamp, data } = JSON.parse(cachedData);
        if (Date.now() - timestamp < CACHE_DURATION) {
          if (isMounted) {
            setContributions(data.contributions);
            setRepositories(data.repositories);
            setStats(data.stats);
            setIsLoading(false);
          }
          return;
        }
      }

      try {
        setIsLoading(true);
        setError(null);

        const headers = {
          'Accept': 'application/vnd.github.v3+json',
          ...(import.meta.env.VITE_GITHUB_TOKEN && {
            'Authorization': `token ${import.meta.env.VITE_GITHUB_TOKEN}`
          })
        };

        const [reposResponse, eventsResponse] = await Promise.all([
          fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`, { headers }),
          fetch(`https://api.github.com/users/${username}/events?per_page=100`, { headers })
        ]);

        if (!reposResponse.ok || !eventsResponse.ok) {
          if (retryCount < 2) {
            // Retry up to 2 times
            await new Promise(resolve => setTimeout(resolve, 1000));
            return fetchGitHubData(retryCount + 1);
          }
          throw new Error('Failed to fetch GitHub data');
        }

        const [reposData, events] = await Promise.all([
          reposResponse.json(),
          eventsResponse.json()
        ]);

        if (!isMounted) return;

        // Process repositories
        const topRepos = reposData
          .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
          .slice(0, 3)
          .map((repo: any) => ({
            name: repo.name,
            description: repo.description,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            url: repo.html_url,
            language: repo.language || 'Unknown'
          }));

        // Process contributions
        const contributionMap = new Map<string, { count: number; types: { [key: string]: number } }>();
        const today = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(today.getFullYear() - 1);

        for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
          contributionMap.set(d.toISOString().split('T')[0], { count: 0, types: { commits: 0, prs: 0, issues: 0 } });
        }

        events.forEach((event: any) => {
          const date = event.created_at.split('T')[0];
          if (new Date(date) >= oneYearAgo) {
            const current = contributionMap.get(date) || { count: 0, types: { commits: 0, prs: 0, issues: 0 } };
            switch (event.type) {
              case 'PushEvent':
                current.count += event.payload.commits?.length || 0;
                current.types.commits += event.payload.commits?.length || 0;
                break;
              case 'PullRequestEvent':
                current.count += 1;
                current.types.prs += 1;
                break;
              case 'IssuesEvent':
                current.count += 1;
                current.types.issues += 1;
                break;
            }
            contributionMap.set(date, current);
          }
        });

        const contributionsArray = Array.from(contributionMap.entries())
          .map(([date, { count, types }]) => ({ date, count, types }))
          .sort((a, b) => a.date.localeCompare(b.date));

        const totalContributions = contributionsArray.reduce((sum, day) => sum + day.count, 0);
        let currentStreak = 0;
        const todayStr = new Date().toISOString().split('T')[0];
        const maxContributions = Math.max(...contributionsArray.map(day => day.count));

        for (let i = contributionsArray.length - 1; i >= 0; i--) {
          const contribution = contributionsArray[i];
          if (contribution.date > todayStr) continue;
          if (contribution.count > 0) {
            currentStreak++;
          } else {
            break;
          }
        }

        if (isMounted) {
          setContributions(contributionsArray);
          setRepositories(topRepos);
          setStats({
            totalContributions,
            streak: currentStreak,
            repositories: reposData.length,
            maxContributions
          });

          // Cache the results
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            timestamp: Date.now(),
            data: {
              contributions: contributionsArray,
              repositories: topRepos,
              stats: {
                totalContributions,
                streak: currentStreak,
                repositories: reposData.length,
                maxContributions
              }
            }
          }));
        }
      } catch (err) {
        console.error('Error fetching GitHub data:', err);
        setError('Failed to load GitHub data. Please try again later.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    if (username) {
      fetchGitHubData();
    }

    return () => {
      isMounted = false;
    };
  }, [username]);

  const getContributionColor = useMemo(() => (count: number) => {
    const intensity = count / (stats.maxContributions || 1);
    if (isDarkMode) {
      if (count === 0) return 'bg-gray-800/80';
      if (intensity <= 0.25) return 'bg-blue-900/80';
      if (intensity <= 0.5) return 'bg-blue-700/80';
      if (intensity <= 0.75) return 'bg-blue-500/80';
      return 'bg-blue-300/80';
    }
    if (count === 0) return 'bg-gray-100/80';
    if (intensity <= 0.25) return 'bg-blue-200/80';
    if (intensity <= 0.5) return 'bg-blue-400/80';
    if (intensity <= 0.75) return 'bg-blue-600/80';
    return 'bg-blue-800/80';
  }, [isDarkMode, stats.maxContributions]);

  const LoadingSkeleton = () => (
    <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-900/30' : 'bg-white/80'} backdrop-blur-sm`} aria-busy="true">
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-1/3 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-300 dark:bg-gray-700 rounded-lg" />
          ))}
        </div>
        <div className="space-y-4">
          <div className="h-6 w-1/4 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="grid grid-cols-[repeat(26,minmax(0,1fr))] sm:grid-cols-53 gap-1">
            {[...Array(182)].map((_, i) => (
              <div key={i} className="w-3 h-3 bg-gray-300 dark:bg-gray-700 rounded-sm" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-6 w-1/4 bg-gray-300 dark:bg-gray-700 rounded" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-300 dark:bg-gray-700 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );

  if (isLoading) return <LoadingSkeleton />;

  if (error) {
    function fetchGitHubData(): void {
      throw new Error('Function not implemented.');
    }

    return (
      <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-900/30' : 'bg-white/80'} backdrop-blur-sm`} role="alert">
        <div className="text-red-500 flex items-center justify-center space-x-2">
          <span>{error}</span>
          <button
            onClick={() => fetchGitHubData()}
            className={`px-3 py-1 rounded-md ${isDarkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-600/20 text-blue-700'}`}
            aria-label="Retry loading GitHub data"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-900/30' : 'bg-white/80'} backdrop-blur-sm shadow-xl`} aria-label="GitHub Activity Section">
      <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} tabIndex={0}>
        <Github className="w-6 h-6" />
        GitHub Activity
      </h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { icon: Calendar, label: 'Contributions', value: stats.totalContributions.toLocaleString() },
          { icon: Calendar, label: 'Streak', value: `${stats.streak} days` },
          { icon: Github, label: 'Repositories', value: stats.repositories },
        ].map(({ icon: Icon, label, value }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            className={`p-4 rounded-lg shadow-sm ${isDarkMode ? 'bg-gray-800/50 hover:bg-gray-800/70' : 'bg-gray-100/80 hover:bg-gray-200/80'} transition-colors duration-200`}
            tabIndex={0}
            aria-label={label}
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold">{label}</h3>
            </div>
            <p className="text-2xl font-bold">{value}</p>
          </motion.div>
        ))}
      </div>

      {/* Contribution Graph */}
      <div className="mb-8 relative">
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`} tabIndex={0}>
          Contribution Activity
        </h3>
        <div className="overflow-x-auto pb-2">
          <div className="inline-grid grid-cols-[repeat(26,minmax(0,1fr))] sm:grid-cols-53 grid-rows-8 gap-1" style={{ minWidth: 'auto' }}>
            {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((day, i) => (
              <div key={i} className={`w-3 h-3 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{day}</div>
            ))}
            {contributions.slice(-182).map((day, index) => (
              <motion.div
                key={day.date}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.001 }}
                className={`w-3 h-3 rounded-sm ${getContributionColor(day.count)} border border-transparent hover:border-blue-400 focus:border-blue-500 cursor-pointer transition-colors duration-150`}
                onMouseEnter={() => setHoveredDate(day.date)}
                onMouseLeave={() => setHoveredDate(null)}
                onFocus={() => setHoveredDate(day.date)}
                onBlur={() => setHoveredDate(null)}
                tabIndex={0}
                aria-label={`${day.date}: ${day.count} contributions`}
              />
            ))}
          </div>
        </div>
        <AnimatePresence>
          {hoveredDate && (contributions.find(c => c.date === hoveredDate)?.count ?? 0) > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`absolute top-0 right-0 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800/80' : 'bg-white/80'} shadow-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} z-10`}
            >
              <p className="text-sm font-semibold">{hoveredDate}</p>
              <p className="text-sm">{contributions.find(c => c.date === hoveredDate)?.count ?? 0} contributions</p>
              <div className="mt-2 space-y-1">
                <p className="text-xs flex items-center gap-1">
                  <Code className="w-4 h-4" /> {contributions.find(c => c.date === hoveredDate)?.types.commits ?? 0} commits
                </p>
                <p className="text-xs flex items-center gap-1">
                  <GitPullRequest className="w-4 h-4" /> {contributions.find(c => c.date === hoveredDate)?.types.prs ?? 0} PRs
                </p>
                <p className="text-xs flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> {contributions.find(c => c.date === hoveredDate)?.types.issues ?? 0} issues
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex items-center justify-end mt-2 text-sm">
          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Less</span>
          <div className="flex gap-1 mx-2">
            {[0, Math.ceil(stats.maxContributions * 0.25), Math.ceil(stats.maxContributions * 0.5), Math.ceil(stats.maxContributions * 0.75), stats.maxContributions].map((count) => (
              <div
                key={count}
                className={`w-3 h-3 rounded-sm ${getContributionColor(count)}`}
                aria-label={`${count} contributions`}
              />
            ))}
          </div>
          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>More</span>
        </div>
      </div>

      {/* Top Repositories */}
      <div>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`} tabIndex={0}>
          Top Repositories
        </h3>
        <div className="space-y-4">
          {repositories.map((repo, i) => (
            <motion.a
              key={repo.name}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.2 }}
              className={`block p-4 rounded-lg border transition-colors duration-200 shadow-sm hover:shadow-md ${
                isDarkMode ? 'bg-gray-800/50 hover:bg-gray-800/70 border-gray-700' : 'bg-gray-100/80 hover:bg-gray-200/80 border-gray-200'
              }`}
              tabIndex={0}
              aria-label={`Repository: ${repo.name}`}
            >
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Github className="w-4 h-4 text-blue-500" />
                {repo.name}
              </h4>
              <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {repo.description || 'No description available'}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm">{repo.stars.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <GitFork className="w-4 h-4 text-purple-500" />
                  <span className="text-sm">{repo.forks.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Code className="w-4 h-4 text-green-500" />
                  <span className="text-sm">{repo.language}</span>
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