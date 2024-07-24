const initHandler = require('./init');
const { IS_DEV } = require('../config');

function socketHandler([socket, io], misc) {
	socket.on('init', rateLimitWrapper(initHandler, { socket, io, misc }));
	socket.on('message', (data) => {
		try {
			const { message } = data;
			io.to(socket.room || 'global').emit('message', {
				from: socket.name,
				userId: String(socket.id),
				time: new Date(),
				message,
			});
		} catch (err) {
			console.error(err);
		}
	});
	socket.on('disconnect', () => {
		io.to(socket.room || 'global').emit('message', {
			from: 'System',
			time: new Date(),
			message: `${socket.name} left the chat`,
		});
	});
}

function rateLimitWrapper(handler, { point = 6, socket, io, misc }) {
	return async (data) => {
		//const ip = parseIp(socket);
		try {
			//const { rateLimiter } = misc;
			//await rateLimiter.consume(String(socket.user._id), point);
			//!IS_DEV && (await rateLimiter.consume(ip, point));
		} catch (err) {
			//console.error(
			//`Rate limit exceeded for ip: ${ip} ${socket?.user?.username}`
			//);
			//return socket.disconnect();
		}
		handler([data, socket, io], misc);
	};
}

module.exports = socketHandler;
