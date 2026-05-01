/**
 * Wraps an async controller function and catches errors automatically
 * @param {Function} requestHandler - async handler function
 * @returns {Function} wrapped handler
 */
export const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export default asyncHandler;
