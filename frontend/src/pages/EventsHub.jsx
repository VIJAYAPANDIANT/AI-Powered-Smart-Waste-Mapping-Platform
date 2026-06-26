import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Users, Calendar, MapPin, Plus, CheckCircle, Trophy } from 'lucide-react';

const EventsHub = () => {
  const { user, token } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Event Creation state (for admin users)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [date, setDate] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  const fetchEvents = async () => {
    setLoading(true);

    const demoEvents = [
      { _id: 'e1', title: 'Golden Gate Park Cleanup', description: 'Join us to clear out litter left after the weekend festival. Gloves provided.', address: 'Golden Gate Park, San Francisco, CA', date: new Date(Date.now() + 86400000 * 2).toISOString(), organizer: { username: 'City Services' }, volunteers: [] },
      { _id: 'e2', title: 'Ocean Beach Plastic Removal', description: 'Help us prevent plastic from entering the ocean. Bring a bucket!', address: 'Ocean Beach, San Francisco, CA', date: new Date(Date.now() + 86400000 * 5).toISOString(), organizer: { username: 'EcoWarriors' }, volunteers: ['u1', 'u2', 'u3'] },
      { _id: 'e3', title: 'Central Park Community Sweep', description: 'Monthly meetup to keep the park pristine. Free coffee included.', address: 'Central Park, New York, NY', date: new Date(Date.now() + 86400000 * 7).toISOString(), organizer: { username: 'NYCParks' }, volunteers: ['u1'] },
      { _id: 'e4', title: 'Thames Riverbank Rescue', description: 'Clearing debris at low tide to protect local wildlife.', address: 'Thames Riverbank, London, UK', date: new Date(Date.now() + 86400000 * 12).toISOString(), organizer: { username: 'LondonGreen' }, volunteers: ['u1', 'u2'] },
      { _id: 'e5', title: 'Shibuya City Cleanup', description: 'Urban cleanup focusing on street-level recyclables and e-waste.', address: 'Shibuya Crossing, Tokyo, Japan', date: new Date(Date.now() + 86400000 * 15).toISOString(), organizer: { username: 'TokyoRecycles' }, volunteers: [] }
    ];

    try {
      const res = await axios.get(`${API_URL}/events`);
      if (res.data.success && res.data.data.length > 0) {
        setEvents(res.data.data);
      } else {
        setEvents(demoEvents);
      }
    } catch (err) {
      setEvents(demoEvents);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleVolunteer = async (eventId) => {
    setSuccessMessage('');
    setErrorMessage('');
    
    if (eventId.startsWith('e')) {
      setSuccessMessage('🎉 Thanks for volunteering! (Demo Mode)');
      setTimeout(() => setSuccessMessage(''), 5000);
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const res = await axios.post(`${API_URL}/events/${eventId}/join`, {}, config);
      if (res.data.success) {
        setSuccessMessage(res.data.message);
        setTimeout(() => setSuccessMessage(''), 5000);
        fetchEvents(); // Refresh volunteer lists
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to volunteer.');
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const payload = {
        title,
        description,
        address,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        date
      };
      const res = await axios.post(`${API_URL}/events`, payload, config);
      if (res.data.success) {
        setSuccessMessage('✨ Cleanup event successfully scheduled!');
        setTimeout(() => setSuccessMessage(''), 5000);
        setShowCreateForm(false);
        // Clear
        setTitle('');
        setDescription('');
        setAddress('');
        setLatitude('');
        setLongitude('');
        setDate('');
        fetchEvents();
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to create event.');
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 space-y-8">
      <div className="glass p-8 rounded-2xl border border-dark-border bg-dark-card flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <Users className="h-7 w-7 text-neon-teal" /> Community Cleanups Hub
          </h2>
          <p className="text-gray-400 text-sm mt-1">Volunteer for local street cleanups, register attendance, and earn +50 Eco Points.</p>
        </div>

        {user?.role === 'admin' && (
          <button 
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-neon-blue to-neon-teal text-dark-bg font-bold px-6 py-3 rounded-xl hover:shadow-neon-glow transition-all cursor-pointer text-xs"
          >
            <Plus className="h-4 w-4" /> Schedule Cleanup
          </button>
        )}
      </div>

      {successMessage && (
        <div className="bg-neon-teal/10 border border-neon-teal/30 text-neon-teal p-4 rounded-xl text-sm font-bold flex items-center gap-2 animate-fade-in shadow-[0_0_10px_rgba(0,245,212,0.1)]">
          <CheckCircle className="h-5 w-5" /> {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-sm font-bold flex items-center gap-2 animate-fade-in">
          {errorMessage}
        </div>
      )}

      {showCreateForm && (
        <div className="glass p-8 rounded-2xl border border-dark-border bg-dark-card max-w-xl mx-auto">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Schedule New Cleanup</h3>
          <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-400 font-semibold mb-1.5">Event Title</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2 text-white focus:outline-none focus:border-neon-blue/60" />
            </div>
            <div>
              <label className="block text-gray-400 font-semibold mb-1.5">Description</label>
              <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2 text-white focus:outline-none focus:border-neon-blue/60" />
            </div>
            <div>
              <label className="block text-gray-400 font-semibold mb-1.5">Meeting Address</label>
              <input type="text" required value={address} onChange={(e) => setAddress(e.target.value)} className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2 text-white focus:outline-none focus:border-neon-blue/60" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 font-semibold mb-1.5">Latitude</label>
                <input type="number" step="any" required value={latitude} onChange={(e) => setLatitude(e.target.value)} className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2 text-white focus:outline-none focus:border-neon-blue/60" />
              </div>
              <div>
                <label className="block text-gray-400 font-semibold mb-1.5">Longitude</label>
                <input type="number" step="any" required value={longitude} onChange={(e) => setLongitude(e.target.value)} className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2 text-white focus:outline-none focus:border-neon-blue/60" />
              </div>
            </div>
            <div>
              <label className="block text-gray-400 font-semibold mb-1.5">Date & Time</label>
              <input type="datetime-local" required value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2 text-white focus:outline-none focus:border-neon-blue/60 cursor-pointer" />
            </div>
            <button type="submit" className="w-full bg-neon-blue text-dark-bg font-bold py-3 rounded-xl mt-4 cursor-pointer">Publish Event</button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center text-xs text-gray-500 py-20">Loading events...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((evt) => (
            <div key={evt._id} className="glass rounded-2xl border border-dark-border bg-dark-card p-6 flex flex-col justify-between hover:neon-border transition-all duration-300">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] uppercase font-bold text-neon-blue px-2.5 py-0.5 rounded-full bg-neon-blue/10 border border-neon-blue/20">
                    {new Date(evt.date) > new Date() ? 'Upcoming' : 'Completed'}
                  </span>
                  <span className="text-[10px] text-gray-500 flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> {new Date(evt.date).toLocaleString()}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{evt.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed mb-6">{evt.description}</p>

                <div className="flex items-start gap-1.5 text-xs text-gray-400 mb-6">
                  <MapPin className="h-4 w-4 text-neon-pink shrink-0 mt-0.5" />
                  <span>{evt.address || evt.location?.address}</span>
                </div>
              </div>

              <div className="border-t border-dark-border/60 pt-4 flex justify-between items-center">
                <span className="text-xs text-gray-500 font-bold flex items-center gap-1.5">
                  <Trophy className="h-4 w-4 text-yellow-400" /> Volunteers: {evt.volunteers?.length || 0}
                </span>

                {new Date(evt.date) > new Date() && (
                  <button 
                    onClick={() => handleVolunteer(evt._id)}
                    className="bg-neon-teal hover:bg-neon-teal/80 text-dark-bg font-bold px-4 py-2 rounded-lg text-xs cursor-pointer transition-colors"
                  >
                    Volunteer Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsHub;
