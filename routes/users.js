const express = require("express")
const {
  signupUser,
  loginUser,
  verifyEmail,
  getUserById,
  updateUserBySession,
  getUserBySession,
  deleteUserBySession,
} = require("../controllers/user")
const sendResponse = require("../middlewares/response")
const { protect } = require("../middlewares/auth")

const router = express.Router()

router.post("/signup", signupUser, sendResponse)
router.post("/login", loginUser, sendResponse)
router.get(
  "/verify-email/:id/:emailVerificationToken",
  verifyEmail,
  sendResponse
)
router.put("/me", protect, updateUserBySession, sendResponse)
router.get("/me", protect, getUserBySession, sendResponse)
router.delete("/me", protect, deleteUserBySession, sendResponse)
router.get("/:id", protect, getUserById, sendResponse)

module.exports = router
