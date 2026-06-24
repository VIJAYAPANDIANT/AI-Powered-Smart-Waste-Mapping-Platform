import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import { MapPin, LayoutDashboard, Trophy, Award, LogOut, LogIn, PlusCircle, Gift, Users } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="glass sticky top-0 z-[2000] px-6 py-4 flex items-center justify-between border-b border-dark-border mb-6">
      <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-wider text-neon-blue neon-text-blue">
        <MapPin className="h-6 w-6 text-neon-blue animate-pulse" />
        SMART<span className="text-gray-100 font-light">WASTE</span>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        <Link to="/map" className="flex items-center gap-1.5 hover:text-neon-blue transition-colors text-sm font-semibold">
          <MapPin className="h-4 w-4" /> Map View
        </Link>
        <Link to="/awareness" className="flex items-center gap-1.5 hover:text-neon-blue transition-colors text-sm font-semibold">
          <Award className="h-4 w-4" /> Eco Awareness
        </Link>
        <Link to="/leaderboard" className="flex items-center gap-1.5 hover:text-neon-blue transition-colors text-sm font-semibold">
          <Trophy className="h-4 w-4" /> Leaderboard
        </Link>
        {user && (
          <>
            <Link to="/dashboard" className="flex items-center gap-1.5 hover:text-neon-blue transition-colors text-sm font-semibold">
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Link>
            <Link to="/marketplace" className="flex items-center gap-1.5 hover:text-neon-blue transition-colors text-sm font-semibold">
              <Gift className="h-4 w-4 text-neon-teal" /> Marketplace
            </Link>
            <Link to="/events" className="flex items-center gap-1.5 hover:text-neon-blue transition-colors text-sm font-semibold">
              <Users className="h-4 w-4 text-neon-teal" /> Cleanups Hub
            </Link>
          </>
        )}
        {user?.role === 'admin' && (
          <Link to="/admin" className="text-red-400 hover:text-red-300 transition-colors text-sm font-semibold border border-red-500/20 px-2 py-0.5 rounded bg-red-500/5">
            Admin Portal
          </Link>
        )}
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <NotificationBell />
            <Link to="/profile" className="text-sm font-bold text-gray-200 border border-neon-blue/30 px-3 py-1.5 rounded-full hover:bg-neon-blue/10 transition-all bg-neon-blue/5">
              {user.username}
            </Link>
            <button 
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="flex items-center gap-1 text-sm font-semibold hover:text-neon-blue transition-colors">
              <LogIn className="h-4 w-4" /> Log In
            </Link>
            <Link to="/register" className="glass border-neon-blue/30 hover:neon-border px-4 py-2 rounded-lg text-sm font-semibold text-neon-blue transition-all bg-neon-blue/5">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
