const mongoose = require('mongoose');
require('dotenv').config();

module.exports = function() {
	mongoose.connect(process.env.DB, { useUnifiedTopology: true, useNewUrlParser: true }, (err, data) => {
		if (err) {
			return console.log('conneciton failed');
		}
		console.log('connection success');
	});
};
