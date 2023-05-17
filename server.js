const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const expressMongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss_clean = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const expres_rate_limit = require("express-rate-limit");

//Routes
const bootcamps = require("./routes/bootcamps.js");
const courses = require("./routes/courses.js");
const auth = require("./routes/auth.js");
const users = require("./routes/users.js");
const reviews = require("./routes/reviews.js");
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
  console.log(`${Date.now()} this is the current date string`);
  next();
});
console.log(process.env.NODE_ENV);

//Cookie Parser
app.use(cookieParser());

//calling the middlewares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Uploading Files
app.use(fileUpload());

// Sanitize Data
app.use(expressMongoSanitize());

// Set security headers
app.use(helmet());

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Preventing cross site scripting
app.use(xss_clean());

// Rate http request limiter
const rateLimiter = expres_rate_limit.rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});
app.use(rateLimiter);

// Prevent Http params polution
app.use(hpp());

// Enable Cross Origin Resourse Sharing
app.use(cors());

//Mount routes
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/reviews", reviews);

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
