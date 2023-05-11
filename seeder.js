const fs = require("fs");
const mongoose = require("mongoose");
const color = require("colors");
const dotenv = require("dotenv");

//Load env variables

dotenv.config({ path: "./config/config.env" });

//Load models
const Bootcamp = require("./models/bootcamps");

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
console.log(fs.readdirSync(`${__dirname}/_data/`));

// console.log(bootcamps);
//Import data into db
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);

    console.log("Data Imported ...".green.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    console.log("Data destroyed...".red.inverse);
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
