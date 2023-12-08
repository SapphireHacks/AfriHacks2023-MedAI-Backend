const CustomError = require("./error")
const {
  handleValidationError,
  handleTypeError,
  handleCastError,
  handleDuplicateKeyError,
} = require("../utils/errorFormatters")

module.exports.routeTryCatcher = function (
  asyncRouteHandler = async (_req, _res, _next) => {}
) {
  return async function (req, res, next) {
    try {
      return await asyncRouteHandler(req, res, next)
    } catch (err) {
      next(new CustomError(err.message, err.statusCode || 500))
    }
  }
}

module.exports.socketTryCatcher = (asyncFunc) => {
  return async function (io, socket, data) {
    try {
      return await asyncFunc(io, socket, data)
    } catch (err) {
      let error = err
      if (err.name === "ValidationError") error = handleValidationError(err)
      if (err.code === 11000) error = handleDuplicateKeyError(err)
      if (err.name === "CastError") error = handleCastError(err)
      if (err.name === "TypeError") error = handleTypeError(err)
      console.log(error, err)
      socket.emit("error", error.message)
    }
  }
}
