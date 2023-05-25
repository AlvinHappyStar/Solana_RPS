const dbConfig = require('./config');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;

db.Status = require('./status.model')(mongoose);
db.Process = require('./process.model')(mongoose);
db.History = require('./history.model')(mongoose);

module.exports = db;
