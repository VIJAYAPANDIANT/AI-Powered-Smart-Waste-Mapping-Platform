import React from 'react';
import { Trophy, Medal, Award } from 'lucide-react';

const LeaderboardTable = ({ standings }) => {
  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.4)]" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-300" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-gray-500 font-semibold">{rank}</span>;
    }
  };

  return (
    <div className="glass rounded-2xl overflow-hidden border border-dark-border bg-dark-card">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-dark-border text-xs uppercase tracking-wider text-gray-400">
              <th className="py-4 px-6">Rank</th>
              <th className="py-4 px-6">User</th>
              <th className="py-4 px-6 text-right">Impact Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-border/40 text-sm">
            {standings.map((user, idx) => (
              <tr 
                key={user._id || idx} 
                className="hover:bg-white/5 transition-colors duration-200"
              >
                <td className="py-4 px-6 flex items-center gap-2">
                  {getRankBadge(user.rank)}
                </td>
                <td className="py-4 px-6 font-bold text-gray-200">
                  {user.username}
                </td>
                <td className="py-4 px-6 text-right font-extrabold text-neon-blue neon-text-blue">
                  {user.impactScore} XP
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardTable;
