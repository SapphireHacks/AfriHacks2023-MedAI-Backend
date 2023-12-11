const { v2: cloudinary } = require("cloudinary")
const DatauriParser = require("datauri/parser")
const CustomError = require("../utils/error")
const parser = new DatauriParser()
cloudinary.config({
  cloud_name: process.env.CLOUDNARY_NAME,
  api_key: process.env.CLOUDNARY_API_KEY,
  api_secret: process.env.CLOUDNARY_API_SECRET,
})
module.exports.geturl = async (req, res, next) => {
<<<<<<< Updated upstream
  if (!req.files || req.files.length === 0) return next()
=======
>>>>>>> Stashed changes
  const done = await Promise.allSettled(
    req.files.map(async (file) => {
      if (file) {
        const fileExt = `.${file.mimetype.split("/")[1]}`
        const formatted = parser.format(fileExt, file.buffer)
        let response
        try {
          response = await cloudinary.uploader.upload(formatted.content, {
            public_id: `${file.fieldname}_${Date.now()}`,
          })
        } catch (err) {
          console.log(err.message)
          next(new CustomError(err.message), 500)
        }
        if (!response) {
          return next(new CustomError("Something went wrong!", 500))
        }
        req.body[file.fieldname] = response.secure_url
      }
    })
  )
  if (done.length !== req.files.length)
    return next(new CustomError("Unable to upload some files!", 500))
  next()
}
