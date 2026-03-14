const express = require('express');
const expressproxy = require('express-http-proxy');
const app = express();

app.use('/user', expressproxy('http://localhost:3001', {
    proxyReqPathResolver: (req) => req.url
}));
app.use('/captain', expressproxy('http://localhost:3002', {
    proxyReqPathResolver: (req) => req.url
}));
app.use('/ride', expressproxy('http://localhost:3003', {
    proxyReqPathResolver: (req) => req.url
}));

app.listen(3000, () => {
    console.log('Gateway server is running on port 3000');
});