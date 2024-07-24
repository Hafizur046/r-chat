const express = require('express');
const multer = require('multer');
const uuid = require('uuid');
const upload = multer({
	storage: multer.diskStorage({
		destination: './uploads/',
		filename: (_req, file, callback) => {
			const { originalname } = file;
			const extension = originalname.split('.').pop();
			callback(null, `${uuid.v1()}.${extension}`);
		},
		limits: {
			fileSize: 10 * 1024 * 1024, //bytes
			files: 1,
		},
	}),
});

function useRoutes(app, io) {
	app.post('/upload', upload.fields([{ name: 'file' }]), (req, res) => {
		const file = req?.files?.file?.[0];
		if (!file) {
			res.json({ err: true });
			return;
		}
		const { filename, originalname } = file;
		const { roomId, userId } = req.body;
		const room = !roomId || roomId === 'undefined' ? 'global' : roomId;
		io.to(room).emit('message', {
			from: req.body.name,
			message: req.body.message,
			file: filename,
			originalname,
			userId: String(userId),
			time: new Date(),
		});
		res.send();
	});
	app.use(express.static('uploads'));
}

module.exports = useRoutes;
