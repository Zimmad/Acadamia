const ErrorResponse = require("../utils/errResponse");
const Review = require("../models/reviews");
const Bootcamp = require("../models/bootcamps");

//@desc     Get Reviews
//@route    Get api/v1/reviews
//@route    Get api/v1/bootcamps/:bootcamoId/reviews
//@access   Public

exports.getReviews = async (req, res, next) => {
  let queryCourses;
  try {
    console.log(req.params.bootcampId);
    if (req.params.bootcampId) {
      const reviews = await Review.find({ bootcamp: req.params.bootcampId });

      //* we only want to use the pagination and querying stuff only we want to get all reviews.
      //* we dont want to use them for specific bootcamp reviews.
      return res.status(200).json({
        success: true,
        count: reviews.length,
        data: reviews,
      });
    } else {
      //   queryCourses = Course.find().populate("bootcamp"); // mongooseModel.find().populate(fieldName:String) will return all
      // queryCourses = Course.find().populate({   path: "bootcamp",  select: "name description",   });

      res.status(200).json(res.advancedResults);
    }

    const courses = await queryCourses;

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    next(new ErrorResponse("Courses not found", 400));
  }
};

//@desc     Get Single Review
//@route    Get api/v1/reviews/:id
//@access   Public

exports.getReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        data: "No Review found with the given id",
      });
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(new ErrorResponse("Reviews not found", 400));
  }
};

//@desc     Add Review
//@route    POST api/v1/bootcamps/:bootcampId/reviews
//@access   Private

exports.addReview = async (req, res, next) => {
  try {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
    if (!bootcamp) {
      res.status(404).json({
        success: false,
        message: `No Bootcamp found with id:${req.params.bootcampId}`,
      });
    }

    const review = await Review.create(req.body);

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(new ErrorResponse("Reviews not found", 400));
  }
};

//@desc     Update Review
//@route    PUT api/v1/reviews/:id
//@access   Private

exports.updateReview = async (req, res, next) => {
  try {
    let review = await Review.findById(req.params.id);
    console.log(req.body, "Review ++++++++++++++++++==");
    if (!review) {
      return res.status(404).json({
        success: false,
        message: `No Review found with id:${req.params.id}`,
      });
    }

    // Make sure review belongs to user or user is admin
    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: `Not authorize to update review with id:${req.params.id}`,
      });
    }
    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    console.log(review, "Review ++++++++++++++++++==");

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(new ErrorResponse("Reviews not found", 400));
  }
};

//@desc     Delete Review
//@route    DELETE api/v1/reviews/:id
//@access   Private

exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    console.log(req.body, "Review ++++++++++++++++++==");
    if (!review) {
      return res.status(404).json({
        success: false,
        message: `No Review found with id:${req.params.id}`,
      });
    }

    // Make sure review belongs to user or user is admin
    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: `Not authorize to update review with id:${req.params.id}`,
      });
    }

    console.log("Awianting the reviewing to be removed from the database");
    // await Review.findByIdAndDelete(req.params.id);
    await review.remove();

    res.status(202).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(new ErrorResponse("Could not delete the review", 400));
  }
};
