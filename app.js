const express = require('express');

// lets my import my database connection so i can use it on this page
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// init bodyparder middleware
app.use(express.json({ extended: false }));

//single end point for testing
app.get('/', (req, res) => res.send('Server started'));

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

// setting up environment variable called port
// this is were heroku will get the port number if i deploy it to heroku or locally on port 8000
const PORT = process.env.PORT || 8000;

// listen on port 8000
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
