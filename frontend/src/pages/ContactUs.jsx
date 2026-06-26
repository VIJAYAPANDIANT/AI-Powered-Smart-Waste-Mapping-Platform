import React from 'react';
import { Mail, User, MapPin, MessageSquare } from 'lucide-react';

const ContactUs = () => {
  const [success, setSuccess] = React.useState(false);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8 animate-fade-in">
      <div className="text-center space-y-4 mb-10">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-teal">
          Get in Touch
        </h1>
        <p className="text-gray-400">Have questions about the Smart Waste Mapping Platform? We're here to help.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Information Card */}
        <div className="glass p-8 rounded-2xl border border-neon-teal/30 bg-dark-card shadow-[0_0_20px_rgba(0,245,212,0.1)] flex flex-col justify-center space-y-8">
          <h2 className="text-2xl font-bold text-white border-b border-dark-border pb-4">Contact Information</h2>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-neon-teal/10 p-3 rounded-full border border-neon-teal/20">
                <User className="h-6 w-6 text-neon-teal" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Platform Admin</p>
                <p className="text-lg font-semibold text-white">Vijayapandian T</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-neon-blue/10 p-3 rounded-full border border-neon-blue/20">
                <Mail className="h-6 w-6 text-neon-blue" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Email Address</p>
                <a href="mailto:vijayapandian112007@gmail.com" className="text-lg font-semibold text-neon-blue hover:underline">
                  vijayapandian112007@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-neon-pink/10 p-3 rounded-full border border-neon-pink/20">
                <MapPin className="h-6 w-6 text-neon-pink" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Headquarters</p>
                <p className="text-lg font-semibold text-white">Global Operations Center</p>
              </div>
            </div>
          </div>
        </div>

        {/* Message Form (UI Only Demo) */}
        <div className="glass p-8 rounded-2xl border border-dark-border bg-dark-card shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-gray-400" /> Send a Message
          </h2>
          
          {success && (
            <div className="mb-6 bg-neon-teal/10 border border-neon-teal/30 text-neon-teal p-4 rounded-xl text-sm font-bold flex items-center justify-center animate-fade-in">
              ✨ Message sent successfully to Admin!
            </div>
          )}
          
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setSuccess(true); setTimeout(() => setSuccess(false), 5000); e.target.reset(); }}>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Your Name</label>
              <input type="text" className="w-full bg-dark-bg border border-dark-border rounded-xl p-3 text-white focus:outline-none focus:border-neon-teal transition-colors" placeholder="John Doe" required />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Email Address</label>
              <input type="email" className="w-full bg-dark-bg border border-dark-border rounded-xl p-3 text-white focus:outline-none focus:border-neon-teal transition-colors" placeholder="john@example.com" required />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Message</label>
              <textarea className="w-full bg-dark-bg border border-dark-border rounded-xl p-3 text-white focus:outline-none focus:border-neon-teal transition-colors min-h-[120px]" placeholder="How can we help you?" required></textarea>
            </div>
            
            <button type="submit" className="w-full bg-neon-teal text-dark-bg font-bold py-3 rounded-xl hover:bg-white hover:shadow-neon-glow transition-all">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
