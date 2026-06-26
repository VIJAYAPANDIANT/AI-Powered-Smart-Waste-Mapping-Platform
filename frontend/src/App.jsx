import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './components/ProtectedRoute';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatbotWidget from './components/ChatbotWidget';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ReportWaste from './pages/ReportWaste';
import MapView from './pages/MapView';
import Awareness from './pages/Awareness';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import LeaderboardPage from './pages/LeaderboardPage';
import AdminDashboard from './pages/AdminDashboard';
import Marketplace from './pages/Marketplace';
import EventsHub from './pages/EventsHub';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import ContactUs from './pages/ContactUs';
function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <div className="min-h-screen bg-dark-bg text-gray-200 flex flex-col justify-between">
            <div>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/map" element={<MapView />} />
                <Route path="/awareness" element={<Awareness />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/contact" element={<ContactUs />} />
                
                {/* Protected Routes */}
                <Route 
                  path="/report-waste" 
                  element={
                    <ProtectedRoute>
                      <ReportWaste />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/marketplace" 
                  element={
                    <ProtectedRoute>
                      <Marketplace />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/events" 
                  element={
                    <ProtectedRoute>
                      <EventsHub />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </div>
            
            <Footer />
            <ChatbotWidget />
          </div>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
