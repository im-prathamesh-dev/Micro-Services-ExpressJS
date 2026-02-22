const mongoose = require('mongoose');
 function connectDB() {
    mongoose.connect(process.env.MoNGODB_URI,).then(() => {
        console.log('User service connected to MongoDB');
    }).catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });
}
module.exports = connectDB;