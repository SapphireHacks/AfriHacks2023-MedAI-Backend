const mongoose = require("mongoose")

const communityMessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "This message must belong to a user!"],
    },
    community: {
      type: mongoose.Schema.ObjectId,
      ref: "Community",
      required: [true, "A message must have be sent to a community"],
    },
    recipients: {
      type: [mongoose.Types.ObjectId],
      ref: "User",
      required: [true, "This message must belong to a user!"],
    },
    message: {
      type: String,
      default: "",
      trim: true,
      collation: {
        locale: "en",
        strength: 2,
      },
    },
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
)

communityMessageSchema.index({ content: "text" })
const CommunityMessage = mongoose.model(
  "CommunityMessage",
  communityMessageSchema
)

module.exports = CommunityMessage
