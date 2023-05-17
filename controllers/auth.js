const crypto = require("crypto");
const ErrorResponse = require("../utils/errResponse");
const User = require("../models/user");
const sendEmail = require("../utils/sendEmail");

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

//@desc     Get current logged in user
//@route    Post api/v1/auth/me
//@access   Private

module.exports.getMe = async function (req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "User not found (Unauthorized)",
    });
  }
};

//@desc     Log User out / Clear Cookies
//@route    Post api/v1/auth/logout
//@access   Private

module.exports.logOut = async function (req, res, next) {
  try {
    res.cookie("token", "none", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
    res.status(200).json({
      success: true,
      data: "loged out",
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "User not found (Unauthorized)",
    });
  }
};

//@desc    Forgot password
//@route    Post api/v1/auth/forgotpassword
//@access   public

module.exports.forgotPassword = async function (req, res, next) {
  try {
    User.find;
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        err: "Theris no user with this email",
      });
    }

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/resetpassword/${resetToken}`;

    const message = `You are recieving this email because you (or someone else)
     has requested the reset Password. Please make a put request to : \n\n ${resetUrl} `;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password reset Token",
        message: message,
      });

      res.status(200).json({
        success: true,
        data: "Email sent",
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.recentPasswordExpired = undefined;
      await user.save({ validateBeforeSave: false });
      return res
        .status(500)
        .json({ success: false, message: "Email could not be sent " });
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    // res.status(401).json({
    //   success: false,
    //   message: "User not found (Unauthorized)",
    // });

    res.status(401).json({
      success: false,
      message: error,
    });
  }
};

//@desc     Reset Password
//@route    PUT api/v1/auth/resetpassword/:resettoken
//@access   Public

module.exports.resetPassword = async function (req, res, next) {
  try {
    console.log(req.params.resettoken);
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resettoken)
      .digest("hex");
    console.log(
      resetPasswordToken,
      "Checking if the reset password token is working properly"
    );
    const user = await User.findOne({
      resetPasswordToken: resetPasswordToken,
      resetPasswordExpired: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400).json({ success: false, message: "Invalid Token" });
    }

    // Set password
    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpired = undefined;

    await user.save();
    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "User not found (Unauthorized)",
    });
  }
};

//@desc   Update user details
//@route    PUT api/v1/auth/updatedetails
//@access   Private

module.exports.updateDetails = async function (req, res, next) {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
    };
    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "User not found (Unauthorized)",
    });
  }
};

//@desc   Update Password
//@route    PUT api/v1/auth/updatepassword
//@access   Private

module.exports.updatePassword = async function (req, res, next) {
  try {
    const user = await User.findById(req.user.id).select("+password");

    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
      return res
        .json(401)
        .json({ success: false, message: "password is incorrect" });
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "User not found (Unauthorized)",
    });
  }
};

//!-------

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
