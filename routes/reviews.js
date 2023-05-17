const express = require("express");
const router = express.Router({ mergeParams: true }); // to get req.params from the other router set {mergeParams:true}

const {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviews");

const advancedResluts = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");
const Review = require("../models/reviews");

router
  .route("/")
  .get(
    advancedResluts(Review, {
      path: "bootcamp",
      select: "name description",
    }),
    getReviews
  )
  .post(protect, authorize(["user", "admin"]), addReview);
router
  .route("/:id")
  .get(getReview)
  .put(protect, authorize(["user", "admin"]), updateReview)
  .delete(protect, authorize(["user", "admin"]), deleteReview);

module.exports = router;
