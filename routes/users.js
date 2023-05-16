const express = require("express");
const router = express.Router({ mergeParams: true }); // to get req.params from the other router set {mergeParams:true}

const {
  getUsers,
  createSingleUser,
  deleteUser,
  getUser,
  updateUser,
} = require("../controllers/users");

const User = require("../models/user");

const advancedResluts = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

router.use(protect);
router.use(authorize("admin"));
router.route("/").get(advancedResluts(User), getUsers).post(createSingleUser);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
