const express = require('express');

const app = express();

//single end point for testing
app.get('/', (req, res) => res.send('Server started'));

// setting up environment variable called port
// this is were heroku will get the port number if i deploy it to heroku or locally on port 8000
const PORT = process.env.PORT || 8000;

// listen on port 8000
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
