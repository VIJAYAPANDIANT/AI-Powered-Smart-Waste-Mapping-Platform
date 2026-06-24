import React, { useEffect, useState } from 'react';
import { getWasteReports, adminUpdateReportStatus, adminAssignTeam } from '../services/api';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { ShieldAlert, Users, Clock, CheckCircle, Award, ListFilter, Trash } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await getWasteReports();
      if (data.success) {
        setReports(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleAction = async (id, action) => {
    try {
      if (action === 'approve') {
        const teamName = prompt('Enter name of cleaning crew to assign:');
        if (teamName) {
          await adminAssignTeam(id, teamName);
        } else {
          await adminUpdateReportStatus(id, 'approved');
        }
      } else if (action === 'reject') {
        await adminUpdateReportStatus(id, 'rejected');
      } else if (action === 'resolve') {
        await adminUpdateReportStatus(id, 'resolved');
      }
      fetchReports();
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  // 1. Calculate KPI Metrics
  const total = reports.length;
  const pending = reports.filter(r => r.status === 'pending').length;
  const inProgress = reports.filter(r => r.status === 'approved').length;
  const resolved = reports.filter(r => r.status === 'resolved').length;
  const activeUsers = new Set(reports.map(r => r.userId?._id || r.userId)).size;

  // 2. Category Distribution Data
  const categories = ['Plastic', 'Organic', 'E-waste', 'Metal', 'Glass', 'Hazardous', 'Other'];
  const categoryCounts = categories.map(cat => reports.filter(r => r.wasteType === cat).length);

  const categoryData = {
    labels: categories,
    datasets: [{
      data: categoryCounts,
      backgroundColor: [
        'rgba(0, 240, 255, 0.65)',
        'rgba(0, 245, 212, 0.65)',
        'rgba(189, 0, 255, 0.65)',
        'rgba(250, 204, 21, 0.65)',
        'rgba(244, 63, 94, 0.65)',
        'rgba(239, 68, 68, 0.65)',
        'rgba(156, 163, 175, 0.65)'
      ],
      borderColor: '#030712',
      borderWidth: 2,
    }]
  };

  // 3. Resolution Rate & Monthly reports mock trend
  const resolutionData = {
    labels: ['Resolved Reports', 'Unresolved Incidents'],
    datasets: [{
      data: [resolved, total - resolved],
      backgroundColor: ['rgba(0, 245, 212, 0.7)', 'rgba(239, 68, 68, 0.2)'],
      borderColor: ['#00f5d4', '#ef4444'],
      borderWidth: 1
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#9ca3af', font: { size: 10 } }
      }
    }
  };

  // Mock user activity logs
  const userActivities = [
    { user: 'jane_green', action: 'Unlocked badge "Eco Champion"', time: '20 mins ago' },
    { user: 'john_doe', action: 'Reported E-waste near Union Square', time: '1 hour ago' },
    { user: 'admin', action: 'Assigned Green Cleanup Squad to Market St', time: '2 hours ago' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <ShieldAlert className="h-7 w-7 text-red-500" />
          Smart City Command Center
        </h2>
        <p className="text-gray-400 text-sm mt-1">Admin oversight dashboard tracking reports, incident priorities, and resolutions.</p>
      </div>

      {loading ? (
        <div className="text-center text-xs text-gray-500 py-20">Loading system command panel...</div>
      ) : (
        <>
          {/* KPI Dashboard Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="glass p-5 rounded-xl border border-dark-border bg-dark-card">
              <span className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Total Reports</span>
              <span className="text-2xl font-extrabold text-white">{total}</span>
            </div>
            <div className="glass p-5 rounded-xl border border-yellow-500/20 bg-yellow-500/5">
              <span className="text-[10px] uppercase font-bold text-yellow-500/80 block mb-2 flex items-center gap-1"><Clock className="h-3 w-3" /> Pending</span>
              <span className="text-2xl font-extrabold text-yellow-400">{pending}</span>
            </div>
            <div className="glass p-5 rounded-xl border border-neon-blue/20 bg-neon-blue/5">
              <span className="text-[10px] uppercase font-bold text-neon-blue block mb-2 flex items-center gap-1"><Award className="h-3 w-3" /> Assigned / Active</span>
              <span className="text-2xl font-extrabold text-neon-blue">{inProgress}</span>
            </div>
            <div className="glass p-5 rounded-xl border border-neon-teal/20 bg-neon-teal/5">
              <span className="text-[10px] uppercase font-bold text-neon-teal block mb-2 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Resolved</span>
              <span className="text-2xl font-extrabold text-neon-teal">{resolved}</span>
            </div>
            <div className="glass p-5 rounded-xl border border-dark-border bg-dark-card">
              <span className="text-[10px] uppercase font-bold text-gray-500 block mb-2 flex items-center gap-1"><Users className="h-3 w-3" /> Active Users</span>
              <span className="text-2xl font-extrabold text-white">{activeUsers}</span>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass p-6 rounded-2xl border border-dark-border bg-dark-card h-[280px]">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Category Distribution</h3>
              <div className="h-[200px]">
                <Doughnut data={categoryData} options={chartOptions} />
              </div>
            </div>

            <div className="glass p-6 rounded-2xl border border-dark-border bg-dark-card h-[280px]">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Resolution Split</h3>
              <div className="h-[200px]">
                <Doughnut data={resolutionData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Tables Row Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Interactive Operations Approval Table */}
            <div className="lg:col-span-2 glass rounded-2xl border border-dark-border bg-dark-card p-6 flex flex-col justify-between h-[360px]">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Approval Operations Queue</h3>
                <div className="overflow-x-auto overflow-y-auto max-h-[250px]">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-dark-border text-gray-500">
                        <th className="py-2.5">Category</th>
                        <th className="py-2.5">Address</th>
                        <th className="py-2.5">Status</th>
                        <th className="py-2.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-border/40">
                      {reports.map((report) => (
                        <tr key={report._id} className="hover:bg-white/5 transition-colors">
                          <td className="py-3 font-bold text-white">{report.wasteType}</td>
                          <td className="py-3 text-gray-400 truncate max-w-[150px]">{report.location?.address}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold border ${
                              report.status === 'resolved' ? 'text-neon-teal border-neon-teal/20' :
                              report.status === 'pending' ? 'text-yellow-400 border-yellow-500/20' :
                              'text-neon-blue border-neon-blue/20'
                            }`}>{report.status}</span>
                          </td>
                          <td className="py-3 text-right space-x-1.5 whitespace-nowrap">
                            {report.status === 'pending' && (
                              <>
                                <button 
                                  onClick={() => handleAction(report._id, 'approve')}
                                  className="bg-neon-blue/15 hover:bg-neon-blue/35 text-neon-blue px-2.5 py-1 rounded cursor-pointer"
                                >
                                  Approve
                                </button>
                                <button 
                                  onClick={() => handleAction(report._id, 'reject')}
                                  className="bg-red-500/15 hover:bg-red-500/35 text-red-400 px-2.5 py-1 rounded cursor-pointer"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {report.status === 'approved' && (
                              <button 
                                onClick={() => handleAction(report._id, 'resolve')}
                                  className="bg-neon-teal/15 hover:bg-neon-teal/35 text-neon-teal px-2.5 py-1 rounded cursor-pointer"
                              >
                                Mark Resolved
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Simulated Live User Action Logger */}
            <div className="glass rounded-2xl border border-dark-border bg-dark-card p-6 h-[360px] flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Live Activity Log</h3>
                <div className="space-y-4 overflow-y-auto max-h-[260px]">
                  {userActivities.map((act, idx) => (
                    <div key={idx} className="p-3 bg-dark-bg/60 border border-dark-border rounded-xl text-[11px] leading-relaxed">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-neon-blue">{act.user}</span>
                        <span className="text-[9px] text-gray-500">{act.time}</span>
                      </div>
                      <p className="text-gray-300">{act.action}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
