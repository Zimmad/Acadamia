const ErrorResponse = require("../utils/errResponse");
const Bootcamp = require("../models/bootcamps");
const asyncHandler = require("../middleware/asyncHandler");

//@desc     Get all Bootcamps
//@route    Get api/v1/bootcamps
//@access   Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find();
  res
    .status(200)
    .send({ success: true, count: bootcamps.length, data: bootcamps });
});

//@desc     Get single Bootcamps
//@route    Get api/v1/bootcamps/:id
//@access   Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  // try {
  const bootcamp = Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    next(err);
  }
  res.status(200).json({ success: true, data: bootcamp });
  // } catch (error) {
  //   next(err);
  // }
});

//@desc     Create single Bootcamps
//@route    POST api/v1/bootcamps/
//@access   Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  // try {
  const bootcamp = await Bootcamp.create(req.body);

  //for successful creation of resource we use the 201 success status code
  res.status(201).send({
    success: true,
    data: bootcamp,
  });
  // } catch (error) {
  //   // res.status(400).send({
  //   //   success: false,
  //   //   err_message: error,
  //   // });
  //   next(err);
  // }
});

//@desc     Update single Bootcamps
//@route    PUT api/v1/bootcamps/:id
//@access   Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, res.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    // return res.status(400).json({ succes: false });
    next(err);
  }
  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

//@desc     Delete single Bootcamps
//@route    DELETE api/v1/bootcamps/:id
//@access   Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  // try {
  const bootcamp = Bootcamp.findByIdAndDelete(req.params.id);
  if (!bootcamp) {
    // res.status(400).json({
    //   success: false,
    // });
    next(err);
  }
  res.status(200).json({
    seccess: true,
    data: bootcamp,
  });
  // } catch (error) {
  //   // res.status(400).json({ success: false });
  //   next(err);
  // }
});
