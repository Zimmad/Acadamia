const path = require("node:path");
const ErrorResponse = require("../utils/errResponse");
const Bootcamp = require("../models/bootcamps");
const geocoder = require("../utils/geocoder");
const { query } = require("express");

//@desc     Get all Bootcamps
//@route    Get api/v1/bootcamps
//@access   Public
exports.getBootcamps = async (req, res, next) => {
  try {
    res.status(200).json(res.advancedResults);
  } catch (error) {
    new ErrorResponse(`Bad Request`, 404);
  }
};

//@desc     Get single Bootcamps
//@route    Get api/v1/bootcamps/:id
//@access   Public
exports.getBootcamp = async (req, res, next) => {
  try {
    console.log(`The object id passed as req.params is ${req.params.id}`);

    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      res.status(400).send({
        success: false,
        data: "Bootcamp not found",
      });
      next(err);
    }
    res.status(200).json({ success: true, data: bootcamp });
  } catch (error) {
    next(err);
  }
};

//@desc     Create single Bootcamps
//@route    POST api/v1/bootcamps/
//@access   Private
exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);

    //for successful creation of resource we use the 201 success status code
    res.status(201).send({
      success: true,
      data: bootcamp,
    });
  } catch (error) {
    // res.status(400).send({
    //   success: false,
    //   err_message: error,
    // });
    next(err);
  }
};

//@desc     Update single Bootcamps
//@route    PUT api/v1/bootcamps/:id
//@access   Private
exports.updateBootcamp = async (req, res, next) => {
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
};

//@desc     Delete single Bootcamps
//@route    DELETE api/v1/bootcamps/:id
//@access   Private
exports.deleteBootcamp = async (req, res, next) => {
  try {
    console.log(`The object id passed as req.params is ${req.params.id}`);

    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
      res.status(400).json({
        success: false,
      });
      // next(err);
    }
    await bootcamp.remove();
    res.status(200).json({
      seccess: true,
      data: bootcamp,
    });
  } catch (error) {
    // res.status(400).json({ success: false });
    next(err);
  }
};

//@desc     Get Bootcamps within a radius
//@route    GET /api/v1/bootcamps/radius/:zipcode:distance  (distace is number of miles, or /:unit for dynamic units(km, mile etc))
//@access   Private
exports.getBootcampsInRadius = async (err, req, res, next) => {
  console.log("inside getBootcampsInRadius");

  const { zipcode, distance } = req.params;
  console.log(zipcode, distance);

  try {
    //Get lat/lon from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].latitude;

    //calculate radius using radians---devide dist by radius of earth
    //Earth radius is 3,663 miles / 6,378 km

    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find({
      location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    });
    console.log(bootcamps);
    if (!bootcamps) {
      res.status(400).json({
        success: false,
      });
      next(err);
    }
    res.status(200).json({
      seccess: true,
      count: bootcamps.length,
      data: bootcamps,
    });
  } catch (error) {
    // res.status(400).json({ success: false });
    next(err);
  }
};

//@desc     Upload Photo for  Bootcamps
//@route    PUT /api/v1/bootcamps/:id/photo
//@access   Private
exports.bootcampPhotUpload = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      res.status(404).json({
        success: false,
        data: `Bootcamp with the id of ${req.params.id} not found `,
      });
    }

    if (!req.files) {
      res.status(400).json({ success: false, data: "Please Upload a file" });
    }

    // Declearing the file const
    const file = req.files.file;
    const fileType = file.mimetype;

    if (!fileType.startsWith("image")) {
      res.status(400).json({
        success: false,
        data: "Please upload an Image file",
      });
    }

    if (file.size > process.env.MAX_FILE_UPLOAD) {
      res.status(400).json({
        success: false,
        data: `File size should not be greater than ${process.env.MAX_FILE_UPLOAD} bytes`,
      });
    }

    // Create custom file name
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          success: false,
          data: "This is not you. This is us.  'Server error'",
        });
      }

      updatedBootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, {
        photo: file.name,
      });
      res.status(200).json({
        seccess: true,
        data: updatedBootcamp.photo,
      });
    });
  } catch (error) {
    // res.status(400).json({ success: false });
    next(error);
  }
};
// const ErrorResponse = require("../utils/errResponse");
// const Bootcamp = require("../models/bootcamps");
// const asyncHandler = require("../middleware/asyncHandler");

// //@desc     Get all Bootcamps
// //@route    Get api/v1/bootcamps
// //@access   Public
// exports.getBootcamps = asyncHandler(async (req, res, next) => {
//   const bootcamps = await Bootcamp.find();
//   res
//     .status(200)
//     .send({ success: true, count: bootcamps.length, data: bootcamps });
// });

// //@desc     Get single Bootcamps
// //@route    Get api/v1/bootcamps/:id
// //@access   Public
// exports.getBootcamp = asyncHandler(async (req, res, next) => {
//   // try {
//   const bootcamp = Bootcamp.findById(req.params.id);
//   if (!bootcamp) {
//     next(err);
//   }
//   res.status(200).json({ success: true, data: bootcamp });
//   // } catch (error) {
//   //   next(err);
//   // }
// });

// //@desc     Create single Bootcamps
// //@route    POST api/v1/bootcamps/
// //@access   Private
// exports.createBootcamp = asyncHandler(async (req, res, next) => {
//   // try {
//   const bootcamp = await Bootcamp.create(req.body);

//   //for successful creation of resource we use the 201 success status code
//   res.status(201).send({
//     success: true,
//     data: bootcamp,
//   });
//   // } catch (error) {
//   //   // res.status(400).send({
//   //   //   success: false,
//   //   //   err_message: error,
//   //   // });
//   //   next(err);
//   // }
// });

// //@desc     Update single Bootcamps
// //@route    PUT api/v1/bootcamps/:id
// //@access   Private
// exports.updateBootcamp = asyncHandler(async (req, res, next) => {
//   const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, res.body, {
//     new: true,
//     runValidators: true,
//   });
//   if (!bootcamp) {
//     // return res.status(400).json({ succes: false });
//     next(err);
//   }
//   res.status(200).json({
//     success: true,
//     data: bootcamp,
//   });
// });

// //@desc     Delete single Bootcamps
// //@route    DELETE api/v1/bootcamps/:id
// //@access   Private
// exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
//   // try {
//   const bootcamp = Bootcamp.findByIdAndDelete(req.params.id);
//   if (!bootcamp) {
//     // res.status(400).json({
//     //   success: false,
//     // });
//     next(err);
//   }
//   res.status(200).json({
//     seccess: true,
//     data: bootcamp,
//   });
//   // } catch (error) {
//   //   // res.status(400).json({ success: false });
//   //   next(err);
//   // }
// });
