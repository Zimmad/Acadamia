const ErrorResponse = require("../utils/errResponse");
const Course = require("../models/course");
const Bootcamp = require("../models/bootcamps");
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

//@desc     Get a courses
//@route    Get api/v1/courses/:id
//@access   Public

exports.getCourse = async (req, res, next) => {
  let queryCourses;
  try {
    console.log(req.params.id);

    const course = await Course.findById(req.params.id).populate({
      path: "bootcamp",
      select: "name description",
    });

    if (!course) {
      res.status(400).send({
        success: false,
        data: `Course with the id:${req.params.id} not found`,
      });
    }
    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    next(new ErrorResponse("Courses not found", 400));
  }
};

//@desc     Add a courses
//@route    POST api/v1/bootcamps/:bootcampId/courses
//@access   Private
exports.addCourse = async (req, res, next) => {
  let queryCourses;
  req.body.bootcamp = req.params.bootcampId;

  try {
    console.log(req.params.bootcampId);

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
    if (!bootcamp) {
      res.status(400).send({
        success: false,
        data: `Bootcamp with the id:${req.params.bootcampId} not found`,
      });
    }

    const course = await Course.create(req.body);
    if (!course) {
      res.status(400).send({
        success: false,
        data: `Could not create course with the input data`,
      });
    }
    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    next(new ErrorResponse("Courses not found", 400));
  }
};

//@desc     Uppdate a courses
//@route    PUT api/v1/courses/:id
//@access   Private
exports.updateCourse = async (req, res, next) => {
  let queryCourses;

  try {
    let course = await Course.findById(req.params.id);
    if (!course) {
      res.status(400).send({
        success: false,
        data: `Course with the id:${req.params.id} not found`,
      });
    }
    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    next(new ErrorResponse("Courses not found", 400));
  }
};

//@desc     Delete a courses
//@route    DELETE api/v1/courses/:id
//@access   Private
exports.deleteCourse = async (req, res, next) => {
  let queryCourses;

  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      res.status(400).send({
        success: false,
        data: `Course with the id:${req.params.id} not found`,
      });
    }
    await course.remove();
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(new ErrorResponse("Courses not found", 400));
  }
};
