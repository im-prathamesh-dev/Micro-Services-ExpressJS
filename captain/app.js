const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const captainRoutes = require('./routes/captain.routes');
const morgan = require('morgan');
const connectDB = require('./db/db');
connectDB();
const rabbit = require('./services/rabbit');
rabbit.getChannel();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/', captainRoutes);


module.exports = app;