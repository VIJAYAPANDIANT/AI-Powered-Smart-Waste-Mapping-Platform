import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createWasteReport } from '../services/api';
import SmartWasteMap from '../components/SmartWasteMap';
import { AlertCircle, Camera, CheckCircle2, MapPin } from 'lucide-react';

const ReportWaste = () => {
  const [address, setAddress] = useState('');
  const [coords, setCoords] = useState(null); // [lat, lng]
  const [wasteType, setWasteType] = useState('Plastic');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleMapClick = (lat, lng) => {
    setCoords([lat, lng]);
    // Reverse geocode dummy simulated address or placeholder if empty
    if (!address) {
      setAddress(`Pinned Location coordinates: [${lat.toFixed(5)}, ${lng.toFixed(5)}]`);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!coords) {
      setError('Please click on the map to specify waste coordinates.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('address', address);
    formData.append('latitude', coords[0]);
    formData.append('longitude', coords[1]);
    formData.append('wasteType', wasteType);
    formData.append('description', description);
    if (photo) {
      formData.append('photo', photo);
    }

    try {
      const res = await createWasteReport(formData);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-6">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-white">Report Environmental Waste</h2>
        <p className="text-gray-400 text-sm mt-2">Help keep your municipality clean by pinning piles and classifying waste details.</p>
      </div>

      {success ? (
        <div className="glass max-w-md mx-auto p-8 rounded-2xl border border-neon-teal/20 text-center flex flex-col items-center">
          <CheckCircle2 className="h-16 w-16 text-neon-teal mb-4 animate-bounce" />
          <h3 className="text-xl font-bold text-white mb-2">Report Submitted!</h3>
          <p className="text-gray-400 text-xs leading-relaxed">Thank you. Your entry has been recorded. Clean crews will check the coordinates soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="glass p-6 rounded-2xl border border-dark-border bg-dark-card space-y-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <MapPin className="h-4 w-4 text-neon-blue" /> Step 1: Pin Location
              </h3>
              <p className="text-xs text-gray-500">Tap anywhere on the dark-mode city map on the right to drop a clean navigation flag.</p>
              
              {coords && (
                <div className="bg-neon-blue/5 border border-neon-blue/20 rounded-xl p-3 text-xs text-neon-blue">
                  Latitude: {coords[0].toFixed(5)}, Longitude: {coords[1].toFixed(5)}
                </div>
              )}

              <div>
                <label className="block text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1.5">Formatted Address</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Market St, San Francisco, CA"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-neon-blue/60"
                />
              </div>
            </div>

            <div className="glass p-6 rounded-2xl border border-dark-border bg-dark-card">
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4 text-neon-pink" /> Step 2: Categorize Pile
                </h3>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-xs text-center">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1.5">Waste Category</label>
                  <select 
                    value={wasteType}
                    onChange={(e) => setWasteType(e.target.value)}
                    className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-neon-blue/60 cursor-pointer"
                  >
                    <option value="Plastic">Plastic Waste</option>
                    <option value="Organic">Organic / Biodegradable</option>
                    <option value="E-waste">Electronic Waste (E-waste)</option>
                    <option value="Metal">Metal Scrap</option>
                    <option value="Glass">Glass Materials</option>
                    <option value="Hazardous">Hazardous Substances</option>
                    <option value="Other">Other Category</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1.5">Description</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide details about volume, blocking paths, odors, etc."
                    rows={3}
                    className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-neon-blue/60"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1.5">Attach Photo Evidence</label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 bg-dark-bg hover:bg-white/5 border border-dark-border rounded-xl px-4 py-2.5 text-xs text-gray-400 cursor-pointer transition-colors">
                      <Camera className="h-4 w-4 text-neon-blue" />
                      Choose File
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange}
                        className="hidden" 
                      />
                    </label>
                    {photoPreview && (
                      <img src={photoPreview} alt="Preview" className="h-12 w-12 object-cover rounded-lg border border-dark-border" />
                    )}
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-neon-blue to-neon-teal hover:shadow-neon-glow transition-all text-dark-bg font-bold py-3 rounded-xl cursor-pointer text-xs"
                >
                  {loading ? 'Reporting...' : 'Publish Incident'}
                </button>
              </form>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <SmartWasteMap 
              selectMode={true} 
              onMapClick={handleMapClick}
              selectedCoords={coords}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportWaste;
