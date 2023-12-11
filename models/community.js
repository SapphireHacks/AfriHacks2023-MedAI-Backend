const mongoose = require("mongoose")

const communitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A community must have a name"],
      trim: true,
      collation: {
        locale: "en",
        strength: 2,
      },
    },
    primaryCoverImage: {
      type: String,
      default: "",
    },
    secondaryCoverImage: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      trim: true,
      collation: {
        locale: "en",
        strength: 2,
      },
      minlength: 30,
      maxlength: 400,
    },
    moderators: {
      type: [mongoose.Schema.ObjectId],
      validate: function (val) {
        return val.length <= 5
      },
      ref: "User",
    },
    tags: {
      type: [String],
      defualt: [],
    },
    reportsCount: {
      type: Number,
      default: 0
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
communitySchema.index({ name: "text", description: "text", tags: "text" })
const Community = mongoose.model("Community", communitySchema)

module.exports = Community
