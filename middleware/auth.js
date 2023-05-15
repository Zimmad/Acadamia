const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errResponse");
const User = require("../models/user");

// Protect Routes
exports.protect = async function (req, res, next) {
  let token;
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ");
      token = token[1];
    }
    // else if(req.cookies.token){
    //     token = req.cookies.token;
    // }

    // Making sure if token exists
    if (!token) {
      return next(
        new ErrorResponse("Not authorized to access this route", 401)
      ); // 401 is used for unauthorized
    }

    // Varify Token
    const decoded = jwt.verify(token, process.jwt.JWT_SECRET);
    console.log(decoded);
    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
};
