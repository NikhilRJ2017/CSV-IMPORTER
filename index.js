require('express-async-errors');
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db/connectDB');
const app = express();

// ********************** importing npm packages **********************//
const expressFileUpload = require('express-fileupload');
const morgan = require('morgan');

// ********************** importing error handler *************************//
const errorHandler = require('./config/middlewares/error_handler');

// ********************** importing routes **********************//
const mainRoutes = require('./routes/index')

// ********************** logger **********************//
app.use(morgan('tiny'))

// ********************** express fileupload middleware ************************//
app.use(expressFileUpload({
    safeFileNames: true,
    preserveExtension: true
}));

// ********************** body parsing middleware ***********************//
app.use(express.json());

// ********************** main routes *************************//
app.use('/api/v1', mainRoutes)

// ********************** error handling middleware ***********************//
app.use(errorHandler)

// ********************** spinning up the server ***********************//
const PORT = process.env.PORT || 5000
const start = async () => { 
    try {
        await connectDB(process.env.MONGO_URL);
        app.listen(PORT, () => console.log(`Server is up and running on port ${PORT}`))
    } catch (error) {
        console.log(error);
    }
}
start();

