const QueryBuilder = require("../utils/QueryBuilder")
const Message = require("../models/message")

module.exports.createMessage = async function (data) {
  let { conversation, conversationOwner, role, content } = data
  let message = new Message({
    conversation,
    conversationOwner,
    content,
    role,
  })
  message = await message.save()
  return await message
}

module.exports.getMultipleMessages = async function (data) {
  let { conversation, userId, query = {} } = data
  query = {
    ...query,
    conversation,
    conversationOwner: userId,
  }
  const MessageQueryBuilder = new QueryBuilder(Message, query)
  return await MessageQueryBuilder.find()
}
