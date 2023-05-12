const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a course title"],
  },

  description: {
    type: String,
    required: [true, "Please add a discription"],
  },
  weeks: {
    type: String,
    required: [true, "Please add number of weeks"],
  },
  tuition: {
    type: Number,
    required: [true, "Please add a Tuition cost"],
  },
  minimumSkill: {
    type: String,
    required: [true, "Please add a minimum skil"],
    enum: ["beginner", "intermediate", "advanced"],
  },
  scholarhipsAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  // Creating a refrence or relationship to a bootcamp. Course shoud be related to a bootcamp
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp", //the model(collection) we are refrencing to..
  },
});

module.exports = mongoose.model("Course", CourseSchema);
