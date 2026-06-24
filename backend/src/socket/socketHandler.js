let io;

const initSocket = (server) => {
  const { Server } = require('socket.io');
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`Socket Connected: ${socket.id}`);

    socket.on('join', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined room`);
    });

    socket.on('disconnect', () => {
      console.log(`Socket Disconnected: ${socket.id}`);
    });
  });

  return io;
};

const sendRealtimeNotification = (userId, notification) => {
  if (!io) return;
  
  if (userId) {
    // Send to specific user room
    io.to(userId.toString()).emit('notification', notification);
  } else {
    // Broadcast globally
    io.emit('notification', notification);
  }
};

module.exports = {
  initSocket,
  sendRealtimeNotification,
};
