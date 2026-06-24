import React, { useEffect, useState } from 'react';
import LeaderboardTable from '../components/LeaderboardTable';
import { Trophy, RefreshCw } from 'lucide-react';

const LeaderboardPage = () => {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStandings = () => {
    setLoading(true);
    // Simulate fetching standings from cached database.
    // In production this maps to a GET /api/leaderboard or parses /api/analytics
    setTimeout(() => {
      setStandings([
        { _id: '1', username: 'admin', impactScore: 500, rank: 1 },
        { _id: '2', username: 'jane_green', impactScore: 250, rank: 2 },
        { _id: '3', username: 'john_doe', impactScore: 180, rank: 3 }
      ]);
      setLoading(false);
    }, 400);
  };

  useEffect(() => {
    fetchStandings();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.4)]" />
            Regional Leaderboard
          </h2>
          <p className="text-gray-400 text-sm mt-1">Top environmental contributors based on impact scores and resolved reports.</p>
        </div>

        <button 
          onClick={fetchStandings}
          className="flex items-center gap-1.5 bg-dark-bg border border-dark-border text-xs px-3.5 py-2 rounded-xl text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center text-xs text-gray-500 py-20">Loading rankings...</div>
      ) : (
        <LeaderboardTable standings={standings} />
      )}
    </div>
  );
};

export default LeaderboardPage;
