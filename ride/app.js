const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const rideRoutes = require('./routes/ride.routes');
const morgan = require('morgan');
const connectDB = require('./db/db');
const rabbit = require('./services/rabbit');
connectDB();
rabbit.getChannel();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/', rideRoutes);

module.exports = app;
