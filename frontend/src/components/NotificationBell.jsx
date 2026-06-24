import React, { useContext, useState } from 'react';
import { SocketContext } from '../context/SocketContext';
import { Bell, Trash2 } from 'lucide-react';

const NotificationBell = () => {
  const { notifications, clearNotifications } = useContext(SocketContext);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-neon-blue rounded-full transition-colors focus:outline-none"
      >
        <Bell className="h-5 w-5" />
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-pink opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-neon-pink"></span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="glass absolute right-0 mt-3 w-80 rounded-xl overflow-hidden shadow-2xl z-50 border border-dark-border py-2">
          <div className="flex items-center justify-between px-4 py-2 border-b border-dark-border">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Notifications</span>
            {notifications.length > 0 && (
              <button 
                onClick={clearNotifications}
                className="text-xs text-gray-500 hover:text-red-400 flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="h-3 w-3" /> Clear
              </button>
            )}
          </div>
          <div className="max-h-60 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                No new notifications
              </div>
            ) : (
              notifications.map((notif, index) => (
                <div key={index} className="px-4 py-3 border-b border-dark-border/50 hover:bg-white/5 transition-colors text-xs">
                  <p className="text-gray-200">{notif.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
