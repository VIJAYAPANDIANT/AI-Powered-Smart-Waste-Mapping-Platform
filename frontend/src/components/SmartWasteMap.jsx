import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { getCurrentLocation } from '../services/locationService';
import { Compass, Layers, Recycle, MapPin, Truck, AlertCircle, Navigation } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Map controller to adjust view dynamically
const FlyToUser = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, 14, { animate: true });
    }
  }, [coords, map]);
  return null;
};

// Recycling center icon (Green)
const RecyclingIcon = L.divIcon({
  className: 'recycling-div-icon',
  html: `<div style="background-color: #00f5d4; width: 16px; height: 16px; border-radius: 50%; border: 2px solid #030712; box-shadow: 0 0 10px #00f5d4"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

// Dynamic cluster marker generator
const getClusterIcon = (count) => {
  return L.divIcon({
    className: 'cluster-div-icon',
    html: `<div style="background: rgba(189, 0, 255, 0.2); border: 2px solid #bd00ff; color: #fff; width: 32px; height: 32px; border-radius: 50%; font-weight: bold; font-size: 11px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 15px #bd00ff">${count}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

const truckIcon = L.divIcon({
  className: 'truck-div-icon',
  html: `<div style="background-color: #00f0ff; font-size: 16px; padding: 4px; border-radius: 50%; border: 2px solid #030712; box-shadow: 0 0 12px #00f0ff; display: flex; align-items: center; justify-content: center;">🚛</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

const SmartWasteMap = ({ reports = [], selectMode = false, onMapClick, selectedCoords, center }) => {
  const defaultCenter = [37.7749, -122.4194]; // San Francisco
  const [gpsCoords, setGpsCoords] = useState(null);
  const [showRecycling, setShowRecycling] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showClusters, setShowClusters] = useState(false);
  const [showTruck, setShowTruck] = useState(false);
  const [truckCoords, setTruckCoords] = useState(defaultCenter);
  const [showRoute, setShowRoute] = useState(false);
  
  // Geo-fencing alerts
  const [showGeoAlert, setShowGeoAlert] = useState(false);
  const [geoAlertMsg, setGeoAlertMsg] = useState('');

  // Check for geo-fencing entry when center shifts
  useEffect(() => {
    if (center && reports.length > 0) {
      const closeHotspot = reports.find(r => {
        const coords = r.location?.coordinates;
        if (!coords || r.status === 'resolved') return false;
        const d = Math.sqrt((center[0] - coords[1])**2 + (center[1] - coords[0])**2);
        return d < 0.009; // within ~900m
      });

      if (closeHotspot) {
        setGeoAlertMsg(`You are entering a high waste accumulation zone near ${closeHotspot.location.address}. Suggestion: Check nearby recycling hubs or join community cleanups.`);
        setShowGeoAlert(true);
      } else {
        setShowGeoAlert(false);
      }
    }
  }, [center, reports]);

  // Setup interval to simulate truck movement towards the first unresolved report
  useEffect(() => {
    let interval;
    if (showTruck) {
      const activeReport = reports.find(r => r.status === 'approved' || r.status === 'pending');
      const targetCoords = activeReport?.location?.coordinates;
      
      if (targetCoords) {
        const targetLat = targetCoords[1];
        const targetLng = targetCoords[0];
        
        // Start truck at a small offset if just initialized
        if (truckCoords[0] === defaultCenter[0] && truckCoords[1] === defaultCenter[1]) {
          setTruckCoords([targetLat + 0.02, targetLng - 0.02]);
        }

        interval = setInterval(() => {
          setTruckCoords((prev) => {
            const currentLat = prev[0];
            const currentLng = prev[1];
            
            // Move 10% closer to target coordinates
            const nextLat = currentLat + (targetLat - currentLat) * 0.12;
            const nextLng = currentLng + (targetLng - currentLng) * 0.12;
            
            return [nextLat, nextLng];
          });
        }, 1200);
      }
    }
    return () => clearInterval(interval);
  }, [showTruck, reports]);

  // Mock recycling centers
  const recyclingCenters = [
    { id: 'rc1', name: 'Smart City E-Waste Recycling Hub', coords: [37.7833, -122.4167], address: 'Civic Center, San Francisco, CA' },
    { id: 'rc2', name: 'Eco Bottles Composting Facility', coords: [37.7599, -122.4348], address: 'Mission District, San Francisco, CA' },
  ];

  const handleGpsDetect = async () => {
    try {
      const location = await getCurrentLocation();
      setGpsCoords([location.latitude, location.longitude]);
      if (selectMode && onMapClick) {
        onMapClick(location.latitude, location.longitude);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const getPriorityColor = (status, type) => {
    if (status === 'resolved') return '#00f5d4'; // Green (Resolved)
    if (type === 'Hazardous' || status === 'pending') return '#ef4444'; // Red (High Priority)
    return '#facc15'; // Orange / Yellow (Medium Priority)
  };

  const getMarkerIcon = (status, type) => {
    const color = getPriorityColor(status, type);
    return L.divIcon({
      className: 'waste-div-icon',
      html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid #030712; box-shadow: 0 0 10px ${color}"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });
  };

  // Group coordinates into basic grid-based clusters for clustering mode
  const getClusteredReports = () => {
    if (!showClusters) return { clusters: [], singles: reports };

    const grid = {};
    const singles = [];
    const threshold = 0.015; // Grid distance threshold

    reports.forEach((report) => {
      const coords = report.location?.coordinates;
      if (!coords) return;
      const lat = coords[1];
      const lng = coords[0];

      const gridLat = Math.round(lat / threshold) * threshold;
      const gridLng = Math.round(lng / threshold) * threshold;
      const key = `${gridLat.toFixed(4)},${gridLng.toFixed(4)}`;

      if (!grid[key]) {
        grid[key] = [];
      }
      grid[key].push(report);
    });

    const clusters = [];
    Object.keys(grid).forEach((key) => {
      const list = grid[key];
      if (list.length > 1) {
        // Calculate average coords
        let sumLat = 0, sumLng = 0;
        list.forEach(r => {
          sumLat += r.location.coordinates[1];
          sumLng += r.location.coordinates[0];
        });
        clusters.push({
          id: key,
          coords: [sumLat / list.length, sumLng / list.length],
          count: list.length,
          reports: list
        });
      } else {
        singles.push(list[0]);
      }
    });

    return { clusters, singles };
  };

  const { clusters, singles } = getClusteredReports();

  return (
    <div className="relative w-full h-[450px] md:h-[550px] rounded-2xl overflow-hidden border border-dark-border shadow-neon-blue">
      {/* Dynamic Action HUD */}
      <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
        <button 
          onClick={handleGpsDetect}
          className="bg-dark-card/90 hover:bg-neon-blue/15 border border-dark-border hover:border-neon-blue text-gray-300 hover:text-neon-blue p-2.5 rounded-xl cursor-pointer transition-all flex items-center gap-1.5 text-xs font-bold backdrop-blur"
          title="Detect Current GPS Location"
        >
          <Compass className="h-4 w-4" /> Locate Me
        </button>

        {!selectMode && (
          <>
            <button 
              onClick={() => {
                setShowHeatmap(!showHeatmap);
                if (!showHeatmap) setShowClusters(false);
              }}
              className={`p-2.5 rounded-xl cursor-pointer transition-all flex items-center gap-1.5 text-xs font-bold backdrop-blur border ${
                showHeatmap 
                  ? 'bg-neon-pink/15 border-neon-pink text-neon-pink' 
                  : 'bg-dark-card/90 border-dark-border text-gray-300 hover:text-neon-pink'
              }`}
            >
              <Layers className="h-4 w-4" /> Heatmap
            </button>

            <button 
              onClick={() => {
                setShowClusters(!showClusters);
                if (!showClusters) setShowHeatmap(false);
              }}
              className={`p-2.5 rounded-xl cursor-pointer transition-all flex items-center gap-1.5 text-xs font-bold backdrop-blur border ${
                showClusters 
                  ? 'bg-neon-purple/15 border-neon-purple text-neon-purple' 
                  : 'bg-dark-card/90 border-dark-border text-gray-300 hover:text-neon-purple'
              }`}
            >
              <MapPin className="h-4 w-4" /> Cluster
            </button>

             <button 
              onClick={() => setShowRecycling(!showRecycling)}
              className={`p-2.5 rounded-xl cursor-pointer transition-all flex items-center gap-1.5 text-xs font-bold backdrop-blur border ${
                showRecycling 
                  ? 'bg-neon-teal/15 border-neon-teal text-neon-teal' 
                  : 'bg-dark-card/90 border-dark-border text-gray-300 hover:text-neon-teal'
              }`}
            >
              <Recycle className="h-4 w-4" /> Recycling Hubs
            </button>

            <button 
              onClick={() => setShowTruck(!showTruck)}
              className={`p-2.5 rounded-xl cursor-pointer transition-all flex items-center gap-1.5 text-xs font-bold backdrop-blur border ${
                showTruck 
                  ? 'bg-neon-blue/15 border-neon-blue text-neon-blue animate-pulse' 
                  : 'bg-dark-card/90 border-dark-border text-gray-300 hover:text-neon-blue'
              }`}
            >
              <Truck className="h-4 w-4" /> Live Tracking
            </button>

            <button 
              onClick={() => setShowRoute(!showRoute)}
              className={`p-2.5 rounded-xl cursor-pointer transition-all flex items-center gap-1.5 text-xs font-bold backdrop-blur border ${
                showRoute 
                  ? 'bg-neon-teal/15 border-neon-teal text-neon-teal animate-pulse' 
                  : 'bg-dark-card/90 border-dark-border text-gray-300 hover:text-neon-teal'
              }`}
            >
              <Navigation className="h-4 w-4" /> Route Optimizer
            </button>
          </>
        )}
      </div>

      <MapContainer 
        center={center || defaultCenter} 
        zoom={12} 
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <FlyToUser coords={gpsCoords || center} />

        {/* Live Tracking Cleaning Truck */}
        {showTruck && truckCoords && (
          <Marker position={truckCoords} icon={truckIcon}>
            <Popup>
              <div className="text-xs p-1">
                <span className="font-extrabold text-neon-blue uppercase text-[9px] block mb-1">Live Tracking</span>
                <p className="text-white font-bold">Smart Clean Truck #08</p>
                <p className="text-gray-400 text-[10px]">En route to reported waste heap...</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Recycling Centers */}
        {showRecycling && !selectMode && recyclingCenters.map((center) => (
          <Marker 
            key={center.id} 
            position={center.coords} 
            icon={RecyclingIcon}
          >
            <Popup>
              <div className="text-xs p-1">
                <span className="font-extrabold text-neon-teal uppercase text-[9px] tracking-wide block mb-1">Recycling Center</span>
                <h4 className="text-gray-200 font-bold mb-1">{center.name}</h4>
                <p className="text-gray-500 text-[10px]">{center.address}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Selected Map Coordinates Flag */}
        {selectMode && selectedCoords && (
          <Marker position={selectedCoords}>
            <Popup>
              <div className="text-xs font-bold">Pin Location</div>
            </Popup>
          </Marker>
        )}

        {/* Standard Single Markers Layer */}
        {!selectMode && !showHeatmap && singles.map((report) => {
          const coords = report.location?.coordinates;
          if (!coords || coords.length !== 2) return null;
          return (
            <Marker 
              key={report._id} 
              position={[coords[1], coords[0]]} 
              icon={getMarkerIcon(report.status, report.wasteType)}
            >
              <Popup>
                <div className="text-xs p-1">
                  <span className={`font-extrabold uppercase text-[9px] tracking-wider block mb-1`} style={{ color: getPriorityColor(report.status, report.wasteType) }}>
                    {report.wasteType} ({report.status})
                  </span>
                  <p className="text-gray-200 font-bold mb-1">{report.description || 'No description'}</p>
                  <p className="text-gray-500 text-[10px]">{report.location.address}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Clustered Markers Layer */}
        {!selectMode && showClusters && clusters.map((cluster) => (
          <Marker 
            key={cluster.id} 
            position={cluster.coords}
            icon={getClusterIcon(cluster.count)}
          >
            <Popup>
              <div className="text-xs p-1">
                <span className="font-extrabold text-neon-purple uppercase text-[10px] tracking-wider block mb-1">Cluster</span>
                <p className="text-gray-200 font-bold mb-1">{cluster.count} reports in this area.</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Heatmap Overlay Simulation */}
        {!selectMode && showHeatmap && reports.map((report) => {
          const coords = report.location?.coordinates;
          if (!coords || coords.length !== 2) return null;
          const color = getPriorityColor(report.status, report.wasteType);
          return (
            <Circle
              key={report._id}
              center={[coords[1], coords[0]]}
              pathOptions={{
                fillColor: color,
                fillOpacity: 0.35,
                color: color,
                weight: 1,
                dashArray: '3, 3'
              }}
              radius={800} // radius in meters
            />
          );
        })}

        {/* Route Optimization Polyline path */}
        {!selectMode && showRoute && reports.length > 0 && (
          <Polyline 
            positions={reports
              .filter(r => r.status === 'approved' || r.status === 'pending')
              .map(r => [r.location.coordinates[1], r.location.coordinates[0]])
            } 
            pathOptions={{ color: '#00f0ff', weight: 4, dashArray: '8, 8', opacity: 0.8 }} 
          />
        )}
      </MapContainer>

      {/* Geo-fencing alert overlay banner toast */}
      {showGeoAlert && (
        <div className="absolute bottom-4 left-4 right-4 z-[400] glass border-neon-pink bg-neon-pink/10 rounded-xl p-4 flex items-start gap-3 backdrop-blur shadow-neon-glow animate-pulse">
          <AlertCircle className="h-5 w-5 text-neon-pink shrink-0 mt-0.5" />
          <div className="text-left">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-neon-pink block mb-1">Geo-fencing accumulation warning</span>
            <p className="text-xs text-gray-200 leading-normal">{geoAlertMsg}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartWasteMap;
