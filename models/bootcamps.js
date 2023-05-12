const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require("../utils/geocoder");
const BootcampSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name "],
      unique: true,
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    slug: {
      type: [
        String,
        "It is the url friendly name of the bootcamp i-e(Node Coures = node-course)",
      ],
    },
    description: {
      type: String,
      required: true,
      maxlength: 500,
    },
    website: {
      type: String,
      // match: [
      //   /https?:\/\/www\.)?[a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1-6}\b([a-zA-Z0-9@:%_\+.~#?&//=]*)/,
      //   "Please enter a valid URL with HTTP or HTTPs",
      // ],
    },
    phone: {
      type: String,
      maxlength: [20, "Phone number cannot be longer than 20"],
    },
    email: {
      tyoe: String,
      // match: [
      //   /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      //   "Please enter a valid email.",
      // ],
    },
    address: {
      type: String,
      require: [true, "Please add an email"],
    },
    location: {
      //GeoJson point
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ["Point"], // 'location.type' must be 'Point'

        //   required: true,
      },
      coordinates: {
        type: [Number],
        //   required: true,
        index: "2dsphere",
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      country: String,
      zipcode: String,
    },

    carrers: {
      type: [String],
      require: true,
      enum: [
        "Web Development",
        "Mobile Development",
        "UI/Ux",
        "Data Science",
        "Business",
        "Other",
      ],
    },
    averageRating: {
      type: Number,
      min: [1, "Rating must be atleast 1"],
      max: [10, "Rating can be at most 10"],
    },
    averageCost: {
      type: Number,
    },
    photo: {
      type: String, // the actual photo will be stored in a file.
      default: "no-photo.jpg",
    },
    housing: {
      type: Boolean,
      default: false,
    },
    jobAssistance: {
      type: Boolean,
      default: false,
    },
    jobGaurantee: {
      type: Boolean,
      default: false,
    },
    acceptGi: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: String,
      default: Date.now(),
    },
  },

  //this will enable the virtuals on the JSON and the js default object.
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Create bootcamp slug from the name.
BootcampSchema.pre("save", function (next) {
  console.log("Slugify ran", this.name);
  this.slug = slugify(this.name, { lower: true });
  next();
});

//Geocode and create location fields
BootcampSchema.pre("save", async function (next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].state,
    country: loc[0].country,
  };

  //NOt saving the address field
  this.address = undefined;
  next();
});

//Cascade delete courses when a bootcamp is deleted
BootcampSchema.pre("remove", async function (next) {
  console.log(`Courses bieng removed from bootcamp ${this._id}`);
  await this.model("Course").deleteMany({ bootcamp: this._id });
});

// Reverse populate with virtuals
BootcampSchema.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "bootcamp",
  justOne: false,
});

module.exports = mongoose.model("Bootcamp", BootcampSchema);
