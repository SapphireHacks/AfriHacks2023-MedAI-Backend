const User = require("../models/user")

const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

module.exports.bcryptEncrypt = async function (value) {
  return await bcrypt.hash(value, 12)
}

module.exports.bcryptCompare = async function (value, hash) {
  return await bcrypt.compare(value, hash)
}

module.exports.signJwt = function (payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" })
}
module.exports.verifyJwt = function (payload) {
  return jwt.verify(payload, process.env.JWT_SECRET)
}

module.exports.validateToken = async function (token) {
  const payload = module.exports.verifyJwt(token)
  if (new Date(Date.now()) - new Date(payload.iat * 1000) > 8.64e7) return null
  return await User.findById({ _id: payload._id })
}
