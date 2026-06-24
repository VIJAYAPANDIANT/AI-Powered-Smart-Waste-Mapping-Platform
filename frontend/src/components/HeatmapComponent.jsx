import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icons issue in React bundle
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Map events listener component to trigger coordinate selection on click
const MapClickHandler = ({ onClick }) => {
  useMapEvents({
    click(e) {
      if (onClick) {
        onClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
};

// Component to dynamically focus map onto coordinate coordinates
const ChangeMapView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

const HeatmapComponent = ({ reports = [], selectMode = false, onMapClick, selectedCoords, center }) => {
  const defaultCenter = [37.7749, -122.4194]; // San Francisco Default

  const getMarkerIcon = (status) => {
    let color = '#facc15'; // yellow (pending)
    if (status === 'resolved') color = '#00f5d4'; // teal
    if (status === 'approved') color = '#00f0ff'; // blue
    if (status === 'rejected') color = '#ef4444'; // red

    // Custom neon circle markers
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 10px ${color}"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });
  };

  return (
    <div className="w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden border border-dark-border relative z-10 shadow-neon-blue">
      <MapContainer 
        center={center || defaultCenter} 
        zoom={12} 
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" // Dark theme carto tile
        />

        <ChangeMapView center={center || selectedCoords || defaultCenter} />

        {selectMode && onMapClick && (
          <MapClickHandler onClick={onMapClick} />
        )}

        {/* Selected custom reporting marker */}
        {selectedCoords && (
          <Marker position={selectedCoords}>
            <Popup>
              <div className="text-xs font-bold">Selected Waste Location</div>
            </Popup>
          </Marker>
        )}

        {/* Render all reported markers */}
        {!selectMode && reports.map((report) => {
          const coords = report.location?.coordinates;
          if (!coords || coords.length !== 2) return null;
          
          const position = [coords[1], coords[0]]; // [lat, lng]
          
          return (
            <Marker 
              key={report._id} 
              position={position}
              icon={getMarkerIcon(report.status)}
            >
              <Popup>
                <div className="text-xs p-1">
                  <span className="font-extrabold text-neon-blue uppercase text-[10px] tracking-wide block mb-1">{report.wasteType}</span>
                  <p className="text-gray-300 font-semibold mb-2">{report.description || 'No description'}</p>
                  <div className="text-[10px] text-gray-500">{report.location.address}</div>
                  <div className="mt-2 text-[10px] uppercase font-bold tracking-wider text-gray-400">Status: {report.status}</div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default HeatmapComponent;
