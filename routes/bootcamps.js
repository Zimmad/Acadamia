const express = require("express");

const router = express.Router({ mergeParams: true });

const {
  getBootcamp,
  getBootcamps,
  createBootcamp,
  deleteBootcamp,
  updateBootcamp,
  getBootcampsInRadius,
  bootcampPhotUpload,
} = require("../controllers/bootcamps");

const Bootcamp = require("../models/bootcamps");

const advancedResluts = require("../middleware/advancedResults");

//Include other resource routers
const courseRouter = require("./courses");

// Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router
  .route("/")
  .get(advancedResluts(Bootcamp, "courses"), getBootcamps)
  .post(createBootcamp);

router.route("/:id/photo").put(bootcampPhotUpload);

router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);
module.exports = router;
