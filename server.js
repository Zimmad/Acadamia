const express = require('express');
const dotenv = require("dotenv");

// Load env variables
dotenv.config({path:'./config/config.env'});

// creating the expres instance
const app = express();


// creating the PORT variable. we access the PORT environment variable through the process.env object
const PORT = process.env.PORT || 5000;
//create server by  
app.listen(PORT, console.log(`server running in ${process.env.NODE_ENV}, on port ${PORT}`));