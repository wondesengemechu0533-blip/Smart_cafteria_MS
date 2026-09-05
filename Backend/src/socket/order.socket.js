// socket/order.socket.js

const { logger } = require('../utils/logger');

const registerOrderHandlers = (io, socket) => {

    // Kitchen staff joins the 'kitchen' room for real-time order broadcasts
    socket.on('join:kitchen', () => {
        socket.join('kitchen');
        logger.info('Socket joined kitchen room', {
            socketId: socket.id,
            userId: socket.user?.id
        });
    });

    // Admin joins the 'admin' room for real-time admin broadcasts
    socket.on('join:admin', () => {
        socket.join('admin');
        logger.info('Socket joined admin room', {
            socketId: socket.id,
            userId: socket.user?.id
        });
    });

    // Delivery staff joins the 'delivery' room for delivery broadcasts
    socket.on('join:delivery', () => {
        socket.join('delivery');
        logger.info('Socket joined delivery room', {
            socketId: socket.id,
            userId: socket.user?.id
        });
    });
    // Leave the delivery room
    socket.on('leave:delivery', () => {
        socket.leave('delivery');
        logger.info('Socket left delivery room', {
            socketId: socket.id,
            userId: socket.user?.id
        });
    });

    // Customer joins their order room to receive real-time updates
    socket.on('order:join', (orderId) => {
        if (!orderId) {
            return;
        }

        const room = `order:${orderId}`;

        socket.join(room);

        logger.info('Socket joined order room', {
            socketId: socket.id,
            userId: socket.user?.id,
            orderId,
            room
        });
    });

    // Customer leaves the order room
    socket.on('order:leave', (orderId) => {
        if (!orderId) {
            return;
        }

        const room = `order:${orderId}`;

        socket.leave(room);

        logger.info('Socket left order room', {
            socketId: socket.id,
            userId: socket.user?.id,
            orderId
        });
    });
};

module.exports = { registerOrderHandlers };