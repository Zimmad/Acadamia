const ErrorResponse = require("../utils/errResponse");
const User = require("../models/user");

//@desc     Register a user
//@route    Post api/v1/auth/register
//@access   Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Create User
    const user = await User.create({
      name: name,
      email: email,
      password: password,
      role: role,
    });

    // Create Token
    // const token = await user.getSignedJwtToken();

    // //* Sending final response
    // res.status(200).json({ success: true, token: token, id: user._id });

    sendTokenResponse(user, 200, res);
  } catch (error) {
    new ErrorResponse(`Bad Request`, 404);
    res
      .status(500)
      .send({ success: false, data: "This is not you, this is us" });
  }
};

//@desc     Login a user
//@route    Post api/v1/auth/login
//@access   Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //Validate email and password
    if (!email || !password) {
      return next(
        new ErrorResponse("Please provide an email and password", 404)
      );
    }

    //*The purpose of select: false in the password field definition
    //* is typically to enhance security by preventing the password from being unintentionally exposed in query results.
    // Check for user
    const user = await User.findOne({ email: email }).select("+password");
    console.log("-------------------------1");
    if (!user) {
      res.status(401).json({
        success: false,
        data: "invalid cradentials",
      });
    }

    //Check if password matches
    const isMatched = await user.matchPassword(password);

    if (!isMatched) {
      res.json(401).json({
        success: false,
        data: "invalid cradentials",
      });
    }

    // // Create Token
    // const token = await user.getSignedJwtToken();

    // //* Sending final response
    // res.status(200).json({ success: true, token: token });

    sendTokenResponse(user, 200, res);
  } catch (error) {
    new ErrorResponse(`Bad Request`, 404);
    res
      .status(500)
      .send({ success: false, data: "This is not you, this is us" });
  }
};

//Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token: token });
};
