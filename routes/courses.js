const express = require("express");
const router = express.Router({ mergeParams: true }); // to get req.params from the other router set {mergeParams:true}

const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses");

const Course = require("../models/course");
const advancedResluts = require("../middleware/advancedResults");

router
  .route("/")
  .get(
    advancedResluts(Course, {
      path: "bootcamp",
      select: "name description",
    }),
    getCourses
  )
  .post(addCourse);
router.route("/:id").get(getCourse).put(updateCourse).delete(deleteCourse);

module.exports = router;
