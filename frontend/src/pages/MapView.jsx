import React, { useEffect, useState } from 'react';
import { getWasteReports } from '../services/api';
import SmartWasteMap from '../components/SmartWasteMap';
import { ListFilter, Map, RefreshCw } from 'lucide-react';

const MapView = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [center, setCenter] = useState([20, 0]); // Global default
  const [zoom, setZoom] = useState(2); // Global zoom default

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await getWasteReports();
      if (data.success) {
        setReports(data.data);
        setFilteredReports(data.data);
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

  useEffect(() => {
    let result = reports;
    if (statusFilter !== 'all') {
      result = result.filter(r => r.status === statusFilter);
    }
    if (typeFilter !== 'all') {
      result = result.filter(r => r.wasteType === typeFilter);
    }
    setFilteredReports(result);
  }, [statusFilter, typeFilter, reports]);

  const handleFocus = (coords) => {
    if (coords && coords.length === 2) {
      setCenter([coords[1], coords[0]]);
      setZoom(14); // Zoom in when focusing on a specific report
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <Map className="h-6 w-6 text-neon-blue" /> Interactive Hotspots Map
          </h2>
          <p className="text-gray-400 text-sm mt-1">Live tracking of reported trash locations throughout the municipality.</p>
        </div>

        <button 
          onClick={fetchReports}
          className="flex items-center gap-1.5 bg-dark-bg border border-dark-border text-xs px-3.5 py-2 rounded-xl text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SmartWasteMap reports={filteredReports} center={center} zoom={zoom} />
        </div>

        <div className="space-y-6">
          <div className="glass p-6 rounded-2xl border border-dark-border bg-dark-card">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <ListFilter className="h-4 w-4 text-neon-blue" /> Filter Options
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-1.5">Status</label>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-blue/60"
                >
                  <option value="all">All Incidents</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-1.5">Waste Type</label>
                <select 
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-blue/60"
                >
                  <option value="all">All Categories</option>
                  <option value="Plastic">Plastic</option>
                  <option value="Organic">Organic</option>
                  <option value="E-waste">E-waste</option>
                  <option value="Metal">Metal</option>
                  <option value="Glass">Glass</option>
                  <option value="Hazardous">Hazardous</option>
                </select>
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-2xl border border-dark-border bg-dark-card flex flex-col h-[280px]">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Location Logs ({filteredReports.length})</h3>
            <div className="flex-1 overflow-y-auto space-y-3">
              {loading ? (
                <div className="text-center text-xs text-gray-500 py-10">Loading locations...</div>
              ) : filteredReports.length === 0 ? (
                <div className="text-center text-xs text-gray-500 py-10">No matches found.</div>
              ) : (
                filteredReports.map((report) => (
                  <div 
                    key={report._id}
                    onClick={() => handleFocus(report.location?.coordinates)}
                    className="p-3 bg-dark-bg hover:border-neon-blue/40 border border-dark-border rounded-xl text-left cursor-pointer transition-all hover:scale-[1.01]"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold text-white uppercase">{report.wasteType}</span>
                      <span className={`text-[9px] uppercase font-semibold px-2 py-0.5 rounded-full border border-dark-border`}>{report.status}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 line-clamp-1">{report.location.address}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
