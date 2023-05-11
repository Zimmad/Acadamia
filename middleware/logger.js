//@desc     Logs request to console

module.exports = (req, res, next) => {
  console.log(`the method on the request is ${req.method}`);
  req.hello =
    "This value is attached to the request object from the middleware";
  console.log("middleware ran");
  next();
};
