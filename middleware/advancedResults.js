const advancedResluts = (model, populate) => async (req, res, next) => {
  console.log(req.query, "Loging all request parameters");
  let queryResults;
  try {
    //*Copy req.querry
    const reqQuerry = { ...req.query };

    // fields to exclude
    const removeFields = ["select", "sort", "page", "limit"];

    //Loop over removeFields and delete from the reqQuerry
    removeFields.forEach((param) => delete reqQuerry[param]);

    //Stringify the querry JSON obj
    let querryStr = JSON.stringify(reqQuerry);

    //get the mongoose filter(operstors) like gt,lt,gte etc from the query string
    querryStr = querryStr.replace(
      /\b(gt|gte|lte|lt|in)\b/g,
      (match) => `$${match}`
    );
    // convert the querry string into JSON obj and then pass it to the .find(queryStr)

    if (!querryStr || querryStr.trim().length === 0) {
      queryResults = model.find();
    } else {
      const jsonifyStr = JSON.parse(querryStr);
      queryResults = model.find(jsonifyStr);
    }

    //Selecting Specific fields
    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      queryResults = queryResults.select(fields);
    }

    //Sorting resources
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      console.log(sortBy);
      queryResults = queryResults.sort(sortBy);
    } else {
      queryResults = queryResults.sort("-createdAt");
    }

    //Paginating responces.
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const skip = (page - 1) * limit; //skiping documents
    let startIndex = skip; // /* let startIndex = {...skip} does not works */
    const endIndex = page * limit;
    const totalDocs = await model.countDocuments();

    queryResults = queryResults.skip(skip).limit(limit);

    if (populate) {
      queryResults = queryResults.populate(populate);
    }

    const result = await queryResults;
    // console.log(result);

    const pagination = {};
    if (endIndex < totalDocs) {
      pagination.next = {
        page: page + 1,
        limit, // it is same as <limit: limit>
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit, //It is same as limit:limit
      };
    }

    res.advancedResults = {
      success: true,
      count: result.length,
      pagination, // It is same as //* pagination : pagination
      data: result,
    };
  } catch (error) {
    next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
    // next(err);
  }

  next();
};

module.exports = advancedResluts;
