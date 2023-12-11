const express = require("express")
const { routeControllers } = require("../controllers/community")
const sendResponse = require("../middlewares/response")
const { multerUpload } = require("../middlewares/multer")
const { protect } = require("../middlewares/auth")
const { geturl } = require("../middlewares/cloudinary")

const router = express.Router()

router.post("/", protect, routeControllers.post, sendResponse)
router.put(
  "/:communityId",
  protect,
  multerUpload.any(),
  geturl,
  routeControllers.put,
  sendResponse
)
router.get("/", routeControllers.getAll, sendResponse)
router.get("/user", protect, routeControllers.getByUser, sendResponse)
router.get("/:communityId", routeControllers.getOneById, sendResponse)
router.delete(
  "/user/:communityId",
  protect,
  routeControllers.leave,
  sendResponse
)
router.post("/:communityId", protect, routeControllers.join, sendResponse)

module.exports = router
