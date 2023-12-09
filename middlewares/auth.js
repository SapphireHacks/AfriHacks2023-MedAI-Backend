const { routeTryCatcher } = require("../utils/controllers")
const { validateToken } = require("../utils/security")
const CustomError = require("../utils/error")

module.exports.protect = routeTryCatcher(async function (req, _res, next) {
  const authHeader = req.headers["authorization"]
  let token
  if (authHeader) {
    token = authHeader.split("Bearer ")[1]
  }else if(req.session){
    token = req.session.token
    console.log("sessions work")
  }
  if (!token) return next(new CustomError("Not allowed!", 403))
  const user = await validateToken(token)
  if (!user) return next(new CustomError("Not allowed!", 403))
  req.user = user
  next()
})

module.exports.socketProtect = async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token || socket.handshake.headers.access_token
    if (!token) return next(new CustomError("Unauthorized!!!", 403))
    const user = await validateToken(token)
    if (!user) return next(new CustomError("Unauthorized!!!", 403))
    socket.user = user
    next()
  } catch (err) {
    next(err)
  }
}
