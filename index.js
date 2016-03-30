// Main starting point of the application
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser')
const morgan = require('morgan');
const router = require('./router.js');
const mongoose = require('mongoose');

// DB Setup
mongoose.connect('mongodb://127.0.0.1:auth/auth');

const app = express()
// app setup (mainly to express working the way we want)
// morgan a middleware for logging incoming request use for debugging
app.use(morgan('combined'));
// parse incoming request specifically in this case to json no matter what the type
app.use(bodyParser.json({ type: '*/*' }));
// passing app into route file
router(app);

// Server setup (getting our express app to talk the outside world)
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on port', port);