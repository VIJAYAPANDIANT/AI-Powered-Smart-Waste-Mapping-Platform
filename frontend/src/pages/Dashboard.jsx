import React, { useEffect, useState } from 'react';
import { getAnalyticsData } from '../services/api';
import StatisticsCards from '../components/StatisticsCards';
import AnalyticsCharts from '../components/AnalyticsCharts';
import { LayoutDashboard, AlertCircle, RefreshCw, Leaf, CheckSquare, QrCode } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const data = await getAnalyticsData();
      if (data.success) {
        setStats(data.data.stats);
        setMonthlyTrends(data.data.monthlyTrends);
        setHotspots(data.data.hotspots);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-neon-blue" />
            Analytics Dashboard
          </h2>
          <p className="text-gray-400 text-sm mt-1">Operational indicators and regional hotspot trends.</p>
        </div>

        <button 
          onClick={fetchDashboardData}
          className="flex items-center gap-1.5 bg-dark-bg border border-dark-border text-xs px-3.5 py-2 rounded-xl text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 text-sm py-20">Loading metrics data...</div>
      ) : (
        <div className="space-y-6">
          <StatisticsCards stats={stats} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AnalyticsCharts monthlyTrends={monthlyTrends} />
            </div>

            <div className="glass p-6 rounded-2xl border border-dark-border bg-dark-card flex flex-col justify-between h-[320px]">
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4 text-neon-pink animate-pulse" />
                  Top Waste Hotspots
                </h3>
                <div className="overflow-y-auto max-h-[220px] space-y-2">
                  {hotspots.length === 0 ? (
                    <div className="text-center text-xs text-gray-500 py-10">No hotspots identified.</div>
                  ) : (
                    hotspots.map((spot, idx) => (
                      <div key={idx} className="p-3 bg-dark-bg/60 border border-dark-border rounded-xl flex items-center justify-between text-xs">
                        <div className="truncate pr-4 text-left">
                          <span className="font-bold text-gray-200 block mb-0.5 truncate">{spot.address || 'Address unmapped'}</span>
                          <span className="text-[10px] text-gray-500">Lat: {spot.latitude.toFixed(4)} Lng: {spot.longitude.toFixed(4)}</span>
                        </div>
                        <span className="text-neon-pink font-extrabold text-xs whitespace-nowrap bg-neon-pink/10 border border-neon-pink/20 px-2 py-0.5 rounded">
                          {spot.count} Reports
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Smart City Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            
            {/* Carbon Savings Calculator */}
            <div className="glass p-6 rounded-2xl border border-neon-teal/20 bg-neon-teal/5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Carbon Footprint Saved</h3>
                  <Leaf className="h-5 w-5 text-neon-teal" />
                </div>
                <p className="text-2xl font-extrabold text-white">
                  {stats ? (stats.resolved * 14.5).toFixed(1) : 0} kg <span className="text-xs font-normal text-gray-400">CO2 offset</span>
                </p>
                <p className="text-[10px] text-gray-500 mt-2 leading-relaxed">
                  Based on 14.5 kg of CO2 offset per 1 kg of resolved garbage recycler processes.
                </p>
              </div>
            </div>

            {/* Smart City Cleanliness Index */}
            <div className="glass p-6 rounded-2xl border border-neon-blue/20 bg-neon-blue/5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Cleanliness Index</h3>
                  <CheckSquare className="h-5 w-5 text-neon-blue" />
                </div>
                <p className="text-2xl font-extrabold text-white">
                  {stats && stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 100}%
                </p>
                <div className="w-full bg-dark-bg h-2 rounded-full mt-3 overflow-hidden border border-dark-border">
                  <div 
                    className="bg-neon-blue h-full"
                    style={{ width: `${stats && stats.total > 0 ? (stats.resolved / stats.total) * 100 : 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* QR Code Utility */}
            <div className="glass p-6 rounded-2xl border border-dark-border bg-dark-card flex flex-col justify-between">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">QR Reporting</h3>
                  <p className="text-[10px] text-gray-500 leading-normal">
                    Generate visual QR codes to print and stick on trash cans so citizens can scan & report instantly.
                  </p>
                </div>
                <div className="p-3 bg-dark-bg border border-dark-border rounded-xl">
                  <QrCode className="h-8 w-8 text-neon-blue" />
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
