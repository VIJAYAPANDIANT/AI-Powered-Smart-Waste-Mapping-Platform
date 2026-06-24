import React, { createContext, useEffect, useState, useContext } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const { user } = useContext(AuthContext);

  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

  useEffect(() => {
    let socketInstance;

    if (user) {
      socketInstance = io(SOCKET_URL);
      setSocket(socketInstance);

      // Join room for specific user
      socketInstance.emit('join', user._id);

      socketInstance.on('notification', (data) => {
        setNotifications((prev) => [data, ...prev]);
        
        // Show native browser alert notification if permitted
        if (Notification.permission === 'granted') {
          new Notification('Smart Waste Mapping Platform', {
            body: data.message,
            icon: '/favicon.ico'
          });
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission();
        }
      });

      socketInstance.on('connect', () => {
        console.log('Socket.io connected to server');
      });
    }

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [user]);

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <SocketContext.Provider value={{ socket, notifications, clearNotifications }}>
      {children}
    </SocketContext.Provider>
  );
};
