
const Conversation = require("../models/conversation")
const QueryBuilder  = require("../utils/QueryBuilder")

module.exports.getSingleConversationById =  async function(id){
  return await Conversation.findById(id)
}

module.exports.createConversation = async function (data) {
  const { participants, title } = data
  const conversation = new Conversation({
    participants,
    title,
  })
  return await conversation.save()
}

module.exports.getMultipleConversations = async function (data) {
  let { conversationId, userId, query = {} } = data
  query = { ...query, _id: conversationId, participants: { $in: userId } }
  const ConversationQueryBuilder = new QueryBuilder(Conversation, query)
  return await ConversationQueryBuilder.find()
}

module.exports.deleteMultipleConversations = async function (query = {}) {
  return await Conversation.deleteMany(query)
}
module.exports.deleteSingleConversationById = async function (id) {
  return await Conversation.findByIdAndDelete(id)
}