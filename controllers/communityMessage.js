const QueryBuilder = require("../utils/QueryBuilder")
const CommunityMessage = require("../models/communityMessage")
const { routeTryCatcher } = require("../utils/controllers")

module.exports.createCommunityMessage = async function (data) {
  let { sender, communityId, recipients, message } = data
  let newCommunityMessage = new CommunityMessage({
    sender,
    community: communityId,
    recipients,
    message,
  })
  return await newCommunityMessage.save()
}

module.exports.getMultipleCommunityMessages = async function (data) {
  let { community, userId, query = {} } = data
  query = {
    ...query,
    community,
    $or: [{ sender: userId }, { recipients: { $in: userId } }],
  }
  const communityMessageQueryBuilder = new QueryBuilder(CommunityMessage, query)
  return await communityMessageQueryBuilder.find()
}

module.exports.routeControllers = {
  getAll: routeTryCatcher(async function (req, res, next) {
    req.response = {
      messages: await module.exports.getMultipleCommunityMessages({
        query: {
          page: req.query.page,
          limit: req.query.limit,
          fields: req.query.fields,
        },
        userId: req.user._id,
        community: req.params.communityId,
      }),
      status: 200,
      message: "Success",
    }
    return next()
  }),
}
