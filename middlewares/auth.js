
module.exports.protect = routeTryCatcher(async function (req, _res, next) {
  const authHeader = req.headers["authorization"]
  let token
  if (authHeader) {
    token = authHeader.split("Bearer ")[1]
  }
  if (!token) return next(new CustomError("Not allowed!", 403))
  user = await validateToken(token)
  if (!user) return next(new CustomError("Not allowed!", 403))
  req.user = user
  next()
})
