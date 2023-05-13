const ErrorResponse = require("../utils/errResponse");

module.exports = function (err, req, res, next) {
  let error = { ...err };

  error.message = err.message;

  // every error object can be different. in development mode log to console
  console.log(err);

  //Mongoose bad objectIdf
  if (err.name === "casterror") {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }
  // Mongoose duplicate key error
  if (err.code === 11000) {
    const message = "Duplicate field value entered.";
    error = ErrorResponse(message, 400);
  }

  // Mongoose validation error. we get the errors from the err arrary ( in this case err is an array ) and then we get the messages.
  if (error.name === "validationerror") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};
