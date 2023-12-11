const express = require("express")
const {
  signupUser,
  loginUser,
  verifyEmail,
  getUserById,
  updateUserBySession,
  getUserBySession,
  deleteUserBySession,
  logoutUser,
} = require("../controllers/user")
const sendResponse = require("../middlewares/response")
const { multerUpload } = require("../middlewares/multer")
const { protect } = require("../middlewares/auth")
const { geturl } = require("../middlewares/cloudinary")

const router = express.Router()

router.post("/signup", signupUser, sendResponse)
router.post("/login", loginUser, sendResponse)
router.get("/logout", logoutUser, sendResponse)
router.get(
  "/verify-email/:id/:emailVerificationToken",
  verifyEmail,
  sendResponse
)
router.put(
  "/me",
  protect,
  multerUpload.any(),
  geturl,
  updateUserBySession,
  sendResponse
)
router.get("/me", protect, getUserBySession, sendResponse)
router.delete("/me", protect, deleteUserBySession, sendResponse)
router.get("/:id", protect, getUserById, sendResponse)

module.exports = router
