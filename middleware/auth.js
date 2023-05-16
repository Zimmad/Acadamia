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
    console.log(token);
    if (!token) {
      return next(
        new ErrorResponse("Not authorized to access this route", 401)
      ); // 401 is used for unauthorized
    }

    // Varify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decoded);
    req.user = await User.findById(decoded.id);
    console.log("Authenticating the user reached an end");
    next();
  } catch (error) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
};

//Grant Role to specifec roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    try {
      console.log("inside the authorize block");
      if (!roles.includes(req.user.role)) {
        new ErrorResponse(
          `${req.user.role} is Not authorized to access this route`,
          403
        );
      }
      next();
    } catch (error) {
      res.status(404).json("User Not authorized");
    }
  };
};
