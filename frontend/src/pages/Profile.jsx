import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getMyWasteReports } from '../services/api';
import WasteReportCard from '../components/WasteReportCard';
import { User, Award, ListCollapse, AwardIcon } from 'lucide-react';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [myReports, setMyReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock list of achievements. In production, this can match the User/Achievements collection
  const achievements = [
    {
      title: 'Eco Beginner',
      description: 'Reported your first waste pile to help clean the planet!',
      badgeUrl: 'https://res.cloudinary.com/demo/image/upload/v1580974719/eco-beginner.png',
      unlocked: true
    },
    {
      title: 'Eco Champion',
      description: 'Earned 100+ impact points by resolving waste piles!',
      badgeUrl: 'https://res.cloudinary.com/demo/image/upload/v1580974719/eco-champion.png',
      unlocked: user?.impactScore >= 100
    }
  ];

  useEffect(() => {
    const fetchMyReports = async () => {
      try {
        const data = await getMyWasteReports();
        if (data.success) {
          setMyReports(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyReports();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 space-y-8">
      <div className="glass p-8 rounded-2xl border border-dark-border bg-dark-card flex flex-col md:flex-row items-center gap-6 justify-between">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-full bg-neon-blue/10 border border-neon-blue/20">
            <User className="h-10 w-10 text-neon-blue" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">{user?.username}</h2>
            <p className="text-gray-400 text-xs mt-1">{user?.email}</p>
            <span className="inline-block mt-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/5 border border-white/10">{user?.role}</span>
          </div>
        </div>

        <div className="text-center md:text-right border-t md:border-t-0 md:border-l border-dark-border/60 pt-4 md:pt-0 md:pl-8">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Impact Score</span>
          <span className="text-4xl font-extrabold text-neon-blue neon-text-blue">{user?.impactScore || 0} XP</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="glass p-6 rounded-2xl border border-dark-border bg-dark-card">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Award className="h-4 w-4 text-neon-teal" /> Badges & Achievements
            </h3>
            
            <div className="space-y-4">
              {achievements.map((ach, idx) => (
                <div 
                  key={idx} 
                  className={`p-4 border rounded-xl flex items-center gap-3 transition-colors ${
                    ach.unlocked 
                      ? 'bg-neon-teal/5 border-neon-teal/20' 
                      : 'bg-dark-bg/60 border-dark-border opacity-40'
                  }`}
                >
                  <AwardIcon className={`h-8 w-8 shrink-0 ${ach.unlocked ? 'text-neon-teal' : 'text-gray-600'}`} />
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      {ach.title}
                      {ach.unlocked && <span className="text-[9px] bg-neon-teal/15 text-neon-teal border border-neon-teal/25 px-1.5 py-0.2 rounded-full uppercase">Unlocked</span>}
                    </h4>
                    <p className="text-gray-400 text-[10px] leading-relaxed mt-1">{ach.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <ListCollapse className="h-4 w-4 text-neon-blue" /> My Reports Log ({myReports.length})
          </h3>

          {loading ? (
            <div className="text-center text-xs text-gray-500 py-10">Loading your entries...</div>
          ) : myReports.length === 0 ? (
            <div className="text-center text-xs text-gray-500 py-10">You haven't reported any waste yet. Keep your city clean!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myReports.map((report) => (
                <WasteReportCard key={report._id} report={report} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
