const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  email: {
    type: String,
    required: [true, "Plese add an email address"],
    unique: true,
    match: [
      /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
      "Please add a valid email",
    ],
  },

  role: {
    type: String,
    enum: ["user", "publisher"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false,
  },
  resetPasswordToken: String,
  recentPasswordExpired: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//Encrypt password using bscryptjs

UserSchema.pre("save", async function (next) {
  console.log("inside the userSchema.pre(save, fn ) method");
  const salt = await bcrypt.genSalt(10);
  console.log(salt);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Sign JWT and return

UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password to hashed password in the database
UserSchema.methods.matchPassword = async function (enterecPassword) {
  return await bcrypt.compare(enterecPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
