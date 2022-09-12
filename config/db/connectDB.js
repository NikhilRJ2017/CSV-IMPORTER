const mongoose = require('mongoose');
const connectDB = (dbURL) => { 
    return mongoose.connect(dbURL);
}
module.exports = connectDB;