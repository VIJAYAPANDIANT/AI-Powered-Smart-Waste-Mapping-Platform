import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Map, AlertTriangle } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden py-16 md:py-24">
      {/* Decorative background glow circles */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-neon-blue/10 rounded-full blur-[100px] -z-10" />

      <div className="max-w-4xl mx-auto text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-neon-blue bg-neon-blue/10 border border-neon-blue/20 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-blue animate-ping" />
            AI-Driven Environmental Mapping
          </span>
        </motion.div>

        <motion.h1 
          className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-neon-blue"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          Mapping the Future of <br className="hidden md:inline" />
          <span className="text-neon-blue neon-text-blue">Smart Waste Management</span>
        </motion.h1>

        <motion.p 
          className="text-base md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Empowering citizens and smart cities to pin, analyze, and resolve waste accumulations using real-time spatial intelligence and AI prediction.
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          <Link 
            to="/report-waste" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-neon-blue to-neon-teal text-dark-bg font-bold px-8 py-3.5 rounded-xl hover:shadow-neon-glow transition-all transform hover:-translate-y-0.5"
          >
            <AlertTriangle className="h-5 w-5" /> Report Waste Pile
          </Link>
          
          <Link 
            to="/map" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 glass hover:bg-white/5 border-neon-blue/20 hover:border-neon-blue/50 text-gray-200 font-bold px-8 py-3.5 rounded-xl transition-all"
          >
            <Map className="h-5 w-5 text-neon-blue" /> View Interactive Map
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
