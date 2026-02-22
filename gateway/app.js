const express = require('express');
const expressproxy = require('express-http-proxy');
const app = express();

app.use('/user', expressproxy('http://localhost:3001'));

app.listen(3000, () => {
    console.log('Gateway server is running on port 3000');
});