const mongoose = require('mongoose');

const config = require('config');

// getting my database string from my config > default file
const db = config.get('mongoURI');

// connecting with mongoose
const connectDB = async () => {
	try {
		// if promise is returned true do this
		await mongoose.connect(db, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false
		});

		console.log('Connected to MongoDB...');
	} catch (err) {
		//if connection is refused do this
		console.error(err.message);

		// exit process with failure
		process.exit(1);
	}
};

//export my DB connection
module.exports = connectDB;
