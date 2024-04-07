const helmet = require("helmet");
const express = require("express");
const connectDB = require("./database/connectDB");

require("dotenv").config();

// //routes
const registerRoute = require("../src/routes/register");
const loginRoute = require("../src/routes/login");
// const quotesRoute = require("../routes/Quotes");
// const userRoute = require("../routes/users");

const app = express();
app.use(helmet());

app.use('/api/vi/user/register', registerRoute);
app.use('/api/v1/user/login', loginRoute);            
// app.use('/train',TrainRoute);

const port = process.env.PORT || 3001;

connectDB();

app.listen(port, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(`connection established successfully at Port: ${port}`);
    }
});