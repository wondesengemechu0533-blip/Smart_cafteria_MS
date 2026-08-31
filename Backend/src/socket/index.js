const jwt = require('jsonwebtoken');
const { logger } = require('../utils/logger');
const { initSocket } = require('../utils/socket');
const { registerOrderHandlers } = require('./order.socket');
const { registerNotificationHandlers } = require('./notification.socket');

const setupSocketIO = (io) => {
    // Store Socket.io instance
    initSocket(io);

    // JWT middleware to populate socket.user for room-based notifications
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;
        if (!token) {
            logger.warn('Socket connection without token');
            return next();
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded;
            next();
        } catch (err) {
            logger.warn('Socket invalid token', { error: err.message });
            next();
        }
    });

    io.on('connection', (socket) => {
        logger.info('Socket client connected', {
            socketId: socket.id,
            userId: socket.user?.id,
            role: socket.user?.role
        });

        registerOrderHandlers(io, socket);
        registerNotificationHandlers(io, socket);

        socket.on('disconnect', (reason) => {
            logger.info('Socket client disconnected', {
                socketId: socket.id,
                reason
            });
        });
    });

    return io;
};

module.exports = { setupSocketIO };