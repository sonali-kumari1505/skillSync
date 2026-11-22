const socketIO = require('socket.io');

const onlineUsers = new Map(); // userId -> Set of socketIds

const initSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    // Student identifies themselves upon connecting
    socket.on('user_connected', (userId) => {
      if (!userId) return;
      socket.join(`user_${userId}`);
      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set());
      }
      onlineUsers.get(userId).add(socket.id);
      io.emit('online_status', { userId, isOnline: true });
    });

    // Join a specific active exchange conversation room
    socket.on('join_conversation', (conversationId) => {
      if (conversationId) {
        socket.join(`conversation_${conversationId}`);
      }
    });

    // Leave a conversation room
    socket.on('leave_conversation', (conversationId) => {
      if (conversationId) {
        socket.leave(`conversation_${conversationId}`);
      }
    });

    // Typing indicators
    socket.on('typing', ({ conversationId, userName }) => {
      socket.to(`conversation_${conversationId}`).emit('user_typing', { conversationId, userName });
    });

    socket.on('stop_typing', ({ conversationId }) => {
      socket.to(`conversation_${conversationId}`).emit('user_stop_typing', { conversationId });
    });

    // Disconnect handler
    socket.on('disconnect', () => {
      for (const [userId, sockets] of onlineUsers.entries()) {
        if (sockets.has(socket.id)) {
          sockets.delete(socket.id);
          if (sockets.size === 0) {
            onlineUsers.delete(userId);
            io.emit('online_status', { userId, isOnline: false });
          }
          break;
        }
      }
    });
  });

  return io;
};

module.exports = { initSocket };
