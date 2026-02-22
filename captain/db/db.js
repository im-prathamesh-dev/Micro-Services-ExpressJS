const mongoose = require('mongoose');
 function connectDB() {
    mongoose.connect(process.env.MoNGODB_URI,).then(() => {
        console.log("✅ Captain Service DB:", mongoose.connection.name);
        console.log('Captain service connected to MongoDB');
    }).catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });
}
module.exports = connectDB;