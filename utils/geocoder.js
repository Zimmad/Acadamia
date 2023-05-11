const NodeGeocoder = require("node-geocoder");

const options = {
  provider: process.env.GEOCODER_ - PROVIDER,
  httpAdapter: "https",
  apiKey: process.env.GEOCODER - API_KEY,
  formatter: null,
};

const geocoder = NodeGeocoder(options);
module.exports = geocoder;
