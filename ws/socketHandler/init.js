const { ADMINISTRATOR_ROOM } = require('../config');
const GREETINGS = {
	'the-penguins-club': 'Welcome to The Penguins Club!',
	[ADMINISTRATOR_ROOM]: 'Welcome Saar, please have a seat',
};
const DYNAMIC_GREETINGS = {
	global: ({ name }) => `Welcome ${name}, please read the rules carefully!`,
};
const VALID_ROOMS = new Set([
	'baler-room',
	'global',
	'dhaka',
	'gazipur',
	'the-penguins-club',
	ADMINISTRATOR_ROOM,
]);
const CHAT_MOVED =
	'Chat has been moved to: http://103.119.100.196/, current server will be unavailable from 18:00';

async function initHandler([data, socket, io]) {
	try {
		const { name, roomId } = data;
		if (roomId && !VALID_ROOMS.has(roomId)) {
			socket.emit('message', { from: 'System', message: 'Invalid Room' });
			return socket.disconnect();
		}
		console.log(`${name} joined from ${socket.handshake.address}`);
		socket.name = name;
		socket.room = String(roomId || 'global');
		io.to(socket.room).emit('message', {
			from: 'System',
			message: `${name} Joined the chat`,
		});
		socket.join(socket.room);
		const genDynamicGreetings = DYNAMIC_GREETINGS[socket.room];
		const greetings = genDynamicGreetings
			? genDynamicGreetings({ name })
			: GREETINGS[socket.room] || 'Welcome aboard!';
		socket.emit('message', {
			from: 'System',
			message: greetings,
			time: new Date(),
		});
		//socket.emit('message', {
		//from: 'System',
		//message: CHAT_MOVED,
		//time: new Date(),
		//});
	} catch (error) {
		console.error(error);
	}
}

module.exports = initHandler;
