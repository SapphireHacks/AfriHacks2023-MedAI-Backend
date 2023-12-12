const { routeTryCatcher } = require("../utils/controllers")
const { validateToken } = require("../utils/security")
const CustomError = require("../utils/error")

module.exports.protect = routeTryCatcher(async function (req, _res, next) {
  const authHeader =
    req.headers["Authorization"] || req.headers["authorization"]
  let token
  console.log("before debug", req.headers, "Be safe")
  if (authHeader) {
    token = authHeader.split("Bearer ")[1]
    // if (typeof token === "string") token = JSON.parse(token)
    console.log(token, authHeader, "debugg Are you safe?")
  }
  // /* */ Hosting provider does not support
  // else if (req.session) {
  //   token = req.session.token
  //   console.log("sessions work", token, req.session)
  // }
  if (!token) return next(new CustomError("Not allowed!", 403))
  console.log("valid token")
  const user = await validateToken(token)
  if (!user) return next(new CustomError("Not allowed!", 403))
  console.log("after user? how")
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
