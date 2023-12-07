const express = require("express")
const path = require("path")
const cookieParser = require("cookie-parser")
const logger = require("morgan")
const globalErrorHandler = require("./middlewares/error")
const CustomError = require("./utils/error")
const indexRouter = require("./routes/index")
const usersRouter = require("./routes/users")
const dotenv = require("dotenv")
dotenv.config({
  path: path.resolve(__dirname, ".env"),
})
const app = express()

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "pug")

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

app.use("/api/v1", indexRouter)
app.use("/api/v1/users", usersRouter)

app.all("*", (req, _, next) => {
  next(
    new CustomError(
      `CANNOT ${req.method} ${req.originalUrl} on this server!`,
      404
    )
  )
})
app.use(globalErrorHandler)

module.exports = app
