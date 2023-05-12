const ErrorResponse = require("../utils/errResponse");
const Bootcamp = require("../models/bootcamps");
const geocoder = require("../utils/geocoder");
const { query } = require("express");

//@desc     Get all Bootcamps
//@route    Get api/v1/bootcamps
//@access   Public
exports.getBootcamps = async (req, res, next) => {
  console.log(req.query, "Loging all request parameters");
  let queryBootcamps;
  try {
    //*Copy req.querry
    const reqQuerry = { ...req.query };

    // fields to exclude
    const removeFields = ["select", "sort", "page", "limit"];

    //Loop over removeFields and delete from the reqQuerry
    removeFields.forEach((param) => delete reqQuerry[param]);

    //Stringify the querry JSON obj
    let querryStr = JSON.stringify(reqQuerry);

    //get the mongoose filter(operstors) like gt,lt,gte etc from the query string
    querryStr = querryStr.replace(
      /\b(gt|gte|lte|lt|in)\b/g,
      (match) => `$${match}`
    );
    // convert the querry string into JSON obj and then pass it to the .find(queryStr)

    if (!querryStr || querryStr.trim().length === 0) {
      queryBootcamps = Bootcamp.find().populate("courses");
    } else {
      const jsonifyStr = JSON.parse(querryStr);
      queryBootcamps = Bootcamp.find(jsonifyStr).populate("courses");
    }

    //Selecting Specific fields
    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      queryBootcamps = queryBootcamps.select(fields);
    }

    //Sorting resources
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      console.log(sortBy);
      queryBootcamps = queryBootcamps.sort(sortBy);
    } else {
      queryBootcamps = queryBootcamps.sort("-createdAt");
    }

    //Paginating responces.
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const skip = (page - 1) * limit; //skiping documents
    queryBootcamps = queryBootcamps.skip(skip).limit(limit);

    let startIndex = skip; // /* let startIndex = {...skip} does not works */
    const endIndex = page * limit;
    const totalDocs = await Bootcamp.countDocuments();

    const bootcamps = await queryBootcamps;
    // console.log(bootcamps);

    const pagination = {};
    if (endIndex < totalDocs) {
      pagination.next = {
        page: page + 1,
        limit, // it is same as <limit: limit>
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit, //It is same as limit:limit
      };
    }

    res.status(200).send({
      success: true,
      count: bootcamps.length,
      pagination, // It is same as //* pagination : pagination
      data: bootcamps,
    });
  } catch (error) {
    next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
    // ne xt(err);
  }
};

//@desc     Get single Bootcamps
//@route    Get api/v1/bootcamps/:id
//@access   Public
exports.getBootcamp = async (err, req, res, next) => {
  try {
    const bootcamp = Bootcamp.findById(req.params.id);
    if (!bootcamp) {
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
exports.deleteBootcamp = async (err, req, res, next) => {
  try {
    console.log(`The object id passed as req.params is ${req.params.id}`);

    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
      res.status(400).json({
        success: false,
      });
      // next(err);
    }
    res.status(200).json({
      seccess: true,
      data: {},
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
      // res.status(400).json({
      //   success: false,
      // });
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
