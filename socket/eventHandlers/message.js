const {
  createMessage,
  getMultipleMessages,
} = require("../../controllers/message")
const { socketTryCatcher } = require("../../utils/controllers")
// const { getCompletion } = require("../../OpenAI/index.js")

const events = {
  new: "new",
  getMany: "getMany",
}

const newMessagesHandler = socketTryCatcher(async (_io, socket, data = {}) => {
  const { newMessages = [], conversation } = data
  const userId = socket.user._id.toString()
  const newUserMessages = await Promise.all(
    newMessages.map(
      async (msg) =>
        await createMessage({
          conversation,
          conversationOwner: userId,
          role: "user",
          content: msg.content,
        })
    )
  )
  // const messages = (await getMultipleMessages({
  //   conversation,
  //   userId,
  //   query: { sort: "-createdAt", limit: 100 },
  // })).map(({role, content}) => ({ role, content }))

  // const aiReply = await getCompletion(messages, "json_object")

  const aiMessage = await createMessage({
    conversation,
    conversationOwner: userId,
    role: "assistant",
    content: "Here is a placeholder response for now",
    // content: JSON.stringify(aiReply),
  })
  socket.emit(events.new, [...newUserMessages, aiMessage])
})

const getMultipleMessagesHandler = socketTryCatcher(
  async (_io, socket, data = {}) => {
    const messages = await getMultipleMessages({
      conversation: data.conversation,
      userId: socket.user._id.toString(),
      query: {
        page: data.page || 1,
        limit: data.limit || 100,
      },
    })
    socket.emit(events.getMany, {
      messages,
      count: messages.length,
      hasMore:
        typeof data.limit === "number"
          ? data.limit === messages.length
          : messages.length === 100,
    })
  }
)

module.exports = {
  [events.new]: newMessagesHandler,
  [events.getMany]: getMultipleMessagesHandler,
}
