const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

//Routes
const bootcamps = require("./routes/bootcamps.js");

// Middlewares
const logger = require("./middleware/logger.js");
const errorHandler = require("./middleware/error.js");

// Load config
dotenv.config({ path: "./config/config.env" });
const connetDb = require("./config/db.js");

//Connect to database
connetDb();

// creating the expres instance
const app = express();

//Json parser middleware
app.use(express.json(), logger, (req, res, next) => {
  console.log(`${Date.now()} this is the current data string`);
  next();
});

console.log(process.env.NODE_ENV);

//calling the middlewares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Mount routes
app.use("/api/v1/bootcamps", bootcamps);

app.use(errorHandler);

// creating the PORT variable. we access the PORT environment variable through the process.env object
const PORT = process.env.PORT || 5000;
//create server by
const server = app.listen(
  PORT,
  console.log(`server running in ${process.env.NODE_ENV}, on port ${PORT}`)
);

//Handle unhandled errors and rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Unhandled Rejection:: ${err.message}`);
  //close the server and exit proces
  server.close(() => {
    process.exit(1);
  });
});
