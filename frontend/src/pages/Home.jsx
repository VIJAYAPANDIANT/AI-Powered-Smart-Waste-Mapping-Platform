import React, { useEffect, useState } from 'react';
import HeroSection from '../components/HeroSection';
import StatisticsCards from '../components/StatisticsCards';
import { getAnalyticsData } from '../services/api';
import { Leaf, Award, ShieldAlert, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAnalyticsData();
        if (data.success) {
          setStats(data.data.stats);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const features = [
    {
      title: 'Geospatial Waste Mapping',
      desc: 'Pinpoint precise trash heaps on our interactive city mapping module.',
      icon: ShieldAlert,
      glowColor: 'text-neon-blue'
    },
    {
      title: 'Gamified Contributions',
      desc: 'Earn impact points, rank on regional scoreboards, and lock badges.',
      icon: Award,
      glowColor: 'text-neon-teal'
    },
    {
      title: 'Smart City Optimizations',
      desc: 'Directing collection fleets to clean hotspot coordinates efficiently.',
      icon: Leaf,
      glowColor: 'text-neon-purple'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      <HeroSection />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <StatisticsCards stats={stats} />
      </motion.div>

      <div className="my-20">
        <h2 className="text-center text-2xl md:text-3xl font-extrabold text-white mb-12 tracking-wide flex items-center justify-center gap-2">
          <Sparkles className="h-6 w-6 text-neon-blue" />
          Key Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx} 
                className="glass p-8 rounded-2xl border border-dark-border bg-dark-card hover:neon-border transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="p-4 rounded-full bg-white/5 border border-white/10 mb-6">
                  <Icon className={`h-8 w-8 ${feat.glowColor}`} />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{feat.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
