const asyncHandler = (fn) => {
  (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;

// const asyncHandler (fn) => {
// return async (req, res, next) => {
//     try {
//       const result = await fn(req, res, next);
//       return result;
//     } catch (error) {
//       next(error);
//     }
//   };
// };
