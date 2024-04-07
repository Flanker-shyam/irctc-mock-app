const helmet = require("helmet");
const express = require("express");
const app = express();
const connectDB = require("./database/connectDB");

require("dotenv").config();

// //routes
const registerRoute = require("../src/routes/register");
const loginRoute = require("../src/routes/login");
const bookTrainRoute = require("../src/routes/bookTrain");
const addTrainRoute = require("../src/routes/addTrain");
const getBookingRoute = require("../src/routes/bookings");

app.use('/api/v1/user/register', registerRoute);
app.use('/api/v1/user/login', loginRoute);     
app.use('/api/v1/train/book', bookTrainRoute); 
app.use('/api/v1/train/add', addTrainRoute);   
app.use('/api/v1/train/booking', getBookingRoute);

app.use(helmet());

const port = process.env.SERVER_PORT || 3001;

app.listen(port, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(`connection established successfully at Port: ${port}`);
        connectDB();
    }
});