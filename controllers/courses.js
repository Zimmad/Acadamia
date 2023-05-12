const ErrorResponse = require("../utils/errResponse");
const Course = require("../models/course");
const course = require("../models/course");

//@desc     Get courses
//@route    Get api/v1/courses
//@route    Get api/v1/bootcamps/:bootcamoId/courses
//@access   Public

exports.getCourses = async (req, res, next) => {
  let queryCourses;
  try {
    console.log(req.params.bootcampId);
    if (req.params.bootcampId) {
      queryCourses = Course.find({ bootcamp: req.params.bootcampId });
    } else {
      //   queryCourses = Course.find().populate("bootcamp"); // mongooseModel.find().populate(fieldName:String) will return all
      queryCourses = Course.find().populate({
        path: "bootcamp",
        select: "name description",
      });
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
