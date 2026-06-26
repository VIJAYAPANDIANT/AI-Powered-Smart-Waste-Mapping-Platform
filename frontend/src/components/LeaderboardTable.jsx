import React from 'react';
import { Trophy, Medal, Award } from 'lucide-react';

const LeaderboardTable = ({ standings }) => {
  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-300 drop-shadow-[0_0_6px_rgba(209,213,219,0.3)]" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600 drop-shadow-[0_0_6px_rgba(217,119,6,0.3)]" />;
      default:
        if (rank <= 10) {
          return (
            <div className="flex items-center justify-center h-6 w-6 rounded-md bg-neon-blue/10 border border-neon-blue/40 text-neon-blue font-bold text-xs shadow-[0_0_8px_rgba(0,240,255,0.2)]">
              {rank}
            </div>
          );
        } else {
          return (
            <div className="flex items-center justify-center h-6 w-6 rounded-md bg-dark-bg border border-gray-700 text-gray-400 font-bold text-xs">
              {rank}
            </div>
          );
        }
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
