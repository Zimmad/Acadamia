const fs = require("fs");
const mongoose = require("mongoose");
const color = require("colors");
const dotenv = require("dotenv");

//Load env variables

dotenv.config({ path: "./config/config.env" });

//Load models
const Bootcamp = require("./models/bootcamps");
const Course = require("./models/course");
const User = require("./models/user");
const Review = require("./models/reviews");

//connect to database

mongoose.connect(
  process.env.MONGO_URI
  //     , {
  //     useNewUrlParser:true,
  //     useCreateIndex:true,
  //     useFindAndModify:false,
  //     useUnifiedTopology:true,
  //  }
);

//Read the Json files
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
);

const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`));

const reviews = JSON.parse(fs.readFileSync(`${__dirname}/_data/reviews.json`));

console.log(fs.readdirSync(`${__dirname}/_data/`));

// console.log(bootcamps);
//Import data into db
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    await User.create(users);
    await Review.create(reviews);

    console.log("Data Imported ...".green.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();

    console.log("Data destroyed...".red.inverse);

    process.exit();
  } catch (error) {
    console.error(err);
  }
};

if (process.argv[2] === "-i") {
  importData();
  console.log(process.argv);
} else if (process.argv[2] === "-d") {
  deleteData();
  console.log(process.argv);
}
