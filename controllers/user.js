const User = require("../models/user")
const { routeTryCatcher } = require("../utils/controllers")
const { bcryptEncrypt, bcryptCompare, signJwt } = require("../utils/security")
const EmailSender = require("../utils/email")
const crypto = require("crypto")

module.exports.signupUser = routeTryCatcher(async function (req, res, next) {
  const expireAt = new Date(Date.now())
  expireAt.setMonth(expireAt.getMonth() + 1)
  const { firstName, lastName, userName, email, password } = req.body
  let user = new User({
    firstName,
    lastName,
    userName,
    email,
    password: await bcryptEncrypt(password),
    emailVerificationToken: crypto.randomBytes(48).toString("hex"),
    expireAt,
  })
  user = await user.save()
  if (user) {
    try {
      const welcomeMsg = {
        from: process.env.APP_EMAIL_ADDRESS,
        to: email,
        subject: "Welcome to MedAI",
      }
      const welcomeOptions = {
        firstName,
        userName,
        emailVerificationLink: `${process.env.CLIENT_URL}/verify-email/${user._id}/${user.emailVerificationToken}`,
        clientUrl: process.env.CLIENT_URL,
      }
      await new EmailSender({
        msg: welcomeMsg,
        template: "welcome",
        options: welcomeOptions,
      }).sendEmail()
      delete user.password
      req.response = {
        data: {
          user,
        },
        message:
          "Account created successfully! An email verification link has been sent to your email.",
        status: 201,
      }
      return next()
    } catch (err) {
      await User.findByIdAndDelete(user._id)
      req.response = {
        message: "Failed to create your account. Please try again.",
        status: 500,
      }
      return next()
    }
  }
})

module.exports.verifyEmail = routeTryCatcher(async (req, _res, next) => {
  const user = await User.findOne({
    _id: req.params.id,
    emailVerificationToken: req.params.emailVerificationToken,
  })
  if (!user) {
    req.response = {
      message: "Unable to verify email. Account does not exist",
      status: 400,
    }
    return next()
  }
  user.expireAt = undefined
  user.isVerified = true
  user.emailVerificationToken = undefined
  await user.save({ validateBeforeSave: false })
  req.response = { message: "Email verified successfully!", status: 200 }
  return next()
})

module.exports.loginUser = routeTryCatcher(async function (req, res, next) {
  const user = await User.findOne({ email: req.body.email })
  req.response = {
    message: "Invalid credentials!",
    status: 400,
  }
  if (!user) return next()
  const isMatchingPassword = await bcryptCompare(
req.body.password,
    user.password,
  )
  console.log(isMatchingPassword)
  if (isMatchingPassword === false) return next()
  const token = await signJwt({ _id: user._id })
  req.response = {
    message: "You are logged in!",
    status: 200,
    data: {
      user,
      token,
    },
  }
  return next()
})
