const fs = require("fs");
const mongoose = require("mongoose");
const color = require("colors");
const dotenv = require("dotenv");

//Load env variables

dotenv.config({ path: "./config/config.env" });

//Load models
const Bootcamp = require("./models/bootcamps");

//connect to database

const connectDb = async function () {
  const conn = mongoose.connect(
    process.env.MONGO_URI
    //     , {
    //     useNewUrlParser:true,
    //     useCreateIndex:true,
    //     useFindAndModify:false,
    //     useUnifiedTopology:true,
    //  }
  );
};
