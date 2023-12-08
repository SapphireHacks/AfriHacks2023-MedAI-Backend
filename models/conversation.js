const mongoose = require("mongoose")
const User = require("../models/user")

const conversationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    participants: {
      type: [
        {
          type: mongoose.Schema.ObjectId,
          ref: "User",
        },
      ],
      validate: [
        async function (val) {
          const allAreValidUsers = (
            await Promise.all(
              val.map(
                async (el) => (await User.countDocuments({ _id: el })) > 0
              )
            )
          ).every((val) => val === true)
          return allAreValidUsers
        },
        "participants must be account holders",
      ],
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("Conversation", conversationSchema)
