const mongoose = require("mongoose");

const connectDb = async function () {
  const conn = mongoose.connect(
    process.env.MONGO_URI
    //     , {
    //     useNewUrlParser:true,
    //     useCreateIndex:true,
    //     useFindAndModify:false,
    //     useUnifiedTopology:true,
    //  }
  );

  console.log(`MongoDb connected: ${(await conn).connection.host}`);
};

module.exports = connectDb;
