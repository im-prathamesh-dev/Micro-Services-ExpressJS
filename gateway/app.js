const express = require('express');
const expressproxy = require('express-http-proxy');
const app = express();

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';
const CAPTAIN_SERVICE_URL = process.env.CAPTAIN_SERVICE_URL || 'http://localhost:3002';
const RIDE_SERVICE_URL = process.env.RIDE_SERVICE_URL || 'http://localhost:3003';

app.use('/user', expressproxy(USER_SERVICE_URL, {
    proxyReqPathResolver: (req) => req.url
}));
app.use('/captain', expressproxy(CAPTAIN_SERVICE_URL, {
    proxyReqPathResolver: (req) => req.url
}));
app.use('/ride', expressproxy(RIDE_SERVICE_URL, {
    proxyReqPathResolver: (req) => req.url
}));

app.listen(3000, () => {
    console.log('Gateway server is running on port 3000');
});