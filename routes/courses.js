const express = require("express");
const router = express.Router({ mergeParams: true }); // to get req.params from the other router set {mergeParams:true}

const {
  getCourses,
  //   getBootcamps,
  //   createBootcamp,
  //   deleteBootcamp,
  //   updateBootcamp,
  //   getBootcampsInRadius,
} = require("../controllers/courses");

router.route("/").get(getCourses);

module.exports = router;
