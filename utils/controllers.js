const CustomError = require("./error")

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
