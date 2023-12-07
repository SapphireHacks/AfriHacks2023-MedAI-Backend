const express = require("express")
const { signupUser, loginUser, verifyEmail } = require("../controllers/user")
const sendResponse = require("../middlewares/response")

const router = express.Router()

router.post("/signup", signupUser, sendResponse)
router.post("/login", loginUser, sendResponse)
router.get(
  "/verify-email/:id/:emailVerificationToken",
  verifyEmail,
  sendResponse
)

module.exports = router
