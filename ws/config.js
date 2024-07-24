require('dotenv').config();
const ENV = {
	IS_DEV: process.env.APP_ENV === 'PROD' ? false : true,
	WS_PORT: process.env.WS_PORT || 5300,
	DB_URI_LOCAL: process.env.DB_URI_LOCAL,
	ADMINISTRATOR_ROOM: process.env.ADMINISTRATOR_ROOM || 'administrator',
};

module.exports = ENV;
