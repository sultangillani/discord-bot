const mongoose = require('mongoose');

async function connectMongoDb(dbURI){
	return mongoose.connect(dbURI);
}

module.exports = {
	connectMongoDb,
};

