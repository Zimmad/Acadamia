const ErrorResponse = require("../utils/errResponse");
const User = require("../models/user");

//@desc     Get all users
//@route    GET api/v1/auth/users
//@access   Privat/admin
exports.getUsers = async (req, res, next) => {
  try {
    res.status(200).json(res.advancedResults);
  } catch (error) {
    next(new ErrorResponse("Users not found", 400));
  }
};

//@desc     Get singel user
//@route    GET api/v1/auth/users/:id
//@access   Privat/admin
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({ succes: true, data: user });
  } catch (error) {
    next(new ErrorResponse("User not found", 400));
  }
};

//@desc     Create singel user
//@route    POST api/v1/auth/users
//@access   Privat/admin
exports.createSingleUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ succes: true, data: user });
  } catch (error) {
    next(new ErrorResponse("Could not creatre the user", 400));
  }
};

//@desc     Update user
//@route    PUT api/v1/auth/users/:id
//@access   Privat/admin
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({ succes: true, data: user });
  } catch (error) {
    next(new ErrorResponse("User not found", 400));
  }
};

//@desc     Delete user
//@route    DELETE api/v1/auth/users/:id
//@access   Privat/admin
exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(201).json({ succes: true, data: {} });
  } catch (error) {
    next(new ErrorResponse("User not found", 400));
  }
};
