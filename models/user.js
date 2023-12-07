const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please provide your first name"],
    },
    lastName: {
      type: String,
      required: [true, "Please provide your last name"],
    },
    userName: {
      type: String,
      required: [true, "Please provide your username"],
      unique: [true, "Username is already taken"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email address"],
      unique: [true, "An account already exists with that email address"],
    },
    password: {
      type: String,
      required: [true, "Please provide a valid password"],
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: [true, "Invalid location"],
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
        required: [true, "Invalid coordinates"],
      },
    },
    previousHealthConditions: {
      type: [String],
      default: [],
    },
    currentHealthConditions: {
      type: [String],
      default: [],
    },
    dob: {
      type: Date,
    },
  },
  {
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
    timestamps: true,
  }
)

const User = mongoose.model("User", userSchema)

module.exports = User
