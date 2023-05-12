const express = require("express");
const router = express.Router({ mergeParams: true }); // to get req.params from the other router set {mergeParams:true}

const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
} = require("../controllers/courses");

router.route("/").get(getCourses).post(addCourse);
router.route("/:id").get(getCourse).put(updateCourse);

module.exports = router;
