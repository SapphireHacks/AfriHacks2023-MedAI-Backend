const mongoose = require("mongoose")

const membershipModel = new mongoose.Schema(
  {
    member: {
      type: mongoose.Schema.ObjectId,
      required: [true, "A membership must have a member"],
      ref: "User",
    },
    community: {
      type: mongoose.Schema.ObjectId,
      required: [true, "A membership must have a community"],
      ref: "Membership",
    },
    isReportedMember: {
      type: Boolean,
      default: false,
    },
    isBlockedMember: {
      type: Boolean,
      default: false,
    },
    isReportedCommunity: {
      type: Boolean,
      default: false
    },
    isBannedMember: {
      type: Boolean,
      default: false
    }
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

const Membership = mongoose.model("Membership", membershipModel)

module.exports = Membership
