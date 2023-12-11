const QueryBuilder = require("../utils/QueryBuilder")
const CommunityMessage = require("../models/communityMessage")

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
  const communityMessageQueryBuilder = new QueryBuilder(communityMessage, query)
  return await communityMessageQueryBuilder.find()
}
