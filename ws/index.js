const socket = require('socket.io');
const mongoose = require('mongoose');
const http = require('http');
const express = require('express');
const { DB_URI_LOCAL, IS_DEV, WS_PORT } = require('./config');
const msgpackParser = require('socket.io-msgpack-parser');
const socketHandler = require('./socketHandler');
const useRoutes = require('./routes');

//mongoose
//.connect(DB_URI_LOCAL, {
//useNewUrlParser: true,
//useUnifiedTopology: true,
//useFindAndModify: false,
//})
//.catch(console.error);

//const db = mongoose.connection;
//db.on('error', (err) => console.error('DB ERROR:', err));
//db.once('open', async (err) => {
//if (!err) return;
//console.error(err);
//});

const app = express();
app.use(
	express.urlencoded({
		limit: '50mb',
		extended: true,
		parameterLimit: 50000,
	})
);
app.use(express.json({ limit: '50mb' }));
app.get('/uploads', express.static('./uploads/'));
const server = http.createServer(app);
const io = socket(server, {
	parser: IS_DEV ? undefined : msgpackParser,
	cors: {
		origin: '*',
		methods: ['GET', 'POST'],
	},
});
useRoutes(app, io);
server.listen(WS_PORT, (err) => {
	if (err) {
		console.error(err);
		return;
	}
	console.log('Server started at port', WS_PORT);
});

io.on('connection', async (socket) => socketHandler([socket, io]), {});
