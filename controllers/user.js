const User = require("../models/user")
const { routeTryCatcher } = require("../utils/controllers")
const {
  bcryptEncrypt,
  bcryptCompare,
  signJwt,
  validateToken,
} = require("../utils/security")
const EmailSender = require("../utils/email")
const crypto = require("crypto")

module.exports.signupUser = routeTryCatcher(async function (req, res, next) {
  const expireAt = new Date(Date.now())
  expireAt.setMonth(expireAt.getMonth() + 1)
  const { email, password } = req.body
  let user = new User({
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
        emailVerificationLink: `${process.env.CLIENT_URL}/verify-email?userId=${user._id}&verificationToken=${user.emailVerificationToken}`,
        clientUrl: process.env.CLIENT_URL,
      }
      await new EmailSender({
        msg: welcomeMsg,
        template: "verifyEmail",
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
      console.log(err)
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

module.exports.logoutUser = routeTryCatcher(async function(req, res, next){
  console.log(req.session)
  req.session && req.session.destroy()
  req.response = {
    status: 200,
    message: "You are logged out!",
  }
  return next()
})

module.exports.loginUser = routeTryCatcher(async function (req, res, next) {
  if (req.session) {
    const user = req.session.token ? await validateToken(req.session.token) : null
    if (user) {
      req.response = {
        message: "You are logged in!",
        status: 200,
        data: {
          user,
          token: req.session.token,
        },
      }
      return next()
    }
  }
  const user = await User.findOne({ email: req.body.email })
  req.response = {
    message: "Invalid credentials!",
    status: 400,
  }
  if (!user) return next()
  const isMatchingPassword = await bcryptCompare(
    req.body.password,
    user.password
  )
  if (isMatchingPassword === false) return next()
  const token = signJwt({ _id: user._id })
  req.session.token = token
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

module.exports.updateUserBySession = routeTryCatcher(async function (
  req,
  res,
  next
) {
  const {
    profileImage,
    email,
    password,
    firstName,
    lastName,
    userName,
    previousHealthConditions,
    currentHealthConditions,
    dob,
  } = req.body
  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    {
      profileImage,
      email,
      password,
      firstName,
      userName,
      lastName,
      previousHealthConditions,
      currentHealthConditions,
      dob,
    },
    { new: true }
  )
  req.response = {
    message: "Updated successfully!",
    status: 200,
    data: {
      user,
    },
  }
  return next()
})

module.exports.getUserBySession = routeTryCatcher(async function (
  req,
  res,
  next
) {
  req.response = {
    message: "Success",
    status: 200,
    data: {
      user: req.user,
    },
  }
  return next()
})

module.exports.deleteUserBySession = routeTryCatcher(async function (
  req,
  res,
  next
) {
  await User.findOneAndDelete({ _id: req.user._id })
  req.response = {
    message: "Success",
    status: 204,
    data: {
      user: req.user,
    },
  }
  return next()
})

module.exports.getUserById = routeTryCatcher(async function (req, res, next) {
  req.response = {
    message: "Success",
    status: 200,
    data: {
      user: await User.findOne({ _id: req.params.id }),
    },
  }
  return next()
})
