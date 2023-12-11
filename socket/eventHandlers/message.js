const {
  createMessage,
  getMultipleMessages,
} = require("../../controllers/message")
const {
  createConversation,
  getSingleConversationById,
} = require("../../controllers/conversation")
const { socketTryCatcher } = require("../../utils/controllers")
// const { getCompletion } = require("../../OpenAI/index.js")

const createDefaultStarterMessage = async (socket, conversationId) =>
  await createMessage({
    conversation: conversationId,
    conversationOwner: socket.user._id.toString(),
    role: "assistant",
    content: `Hello ${socket.user.firstName}, How may I assist you today?`,
  })

const events = {
  new: "new",
  getMany: "getMany",
  initMessage: "initMessage",
}

const newMessagesHandler = socketTryCatcher(async (_io, socket, data = {}) => {
  const { newMessage, conversationId } = data
  let conversation = conversationId
    ? await getSingleConversationById(conversationId)
    : null
  let starterMessage
  if (!conversation) {
    conversation = await createConversation({
      participants: [socket.user._id.toString()],
      title: newMessage.content?.split(" ")[0] || "Doc MedAI",
    })
    starterMessage = await createDefaultStarterMessage(socket, conversation._id)
  }

  const userId = socket.user._id.toString()
  const newUserMessage = await createMessage({
    conversation: conversation._id,
    conversationOwner: userId,
    role: "user",
    content: newMessage.content,
  })
  // const messages = (await getMultipleMessages({
  //   conversation,
  //   userId,
  //   query: { sort: "-createdAt", limit: 100 },
  // })).map(({role, content}) => ({ role, content }))

  // const aiReply = await getCompletion(messages, "json_object")

  const aiMessage = await createMessage({
    conversation: conversation._id,
    conversationOwner: userId,
    role: "assistant",
    content:
      "Here is a placeholder response for now, while we wait for our AI model to finish learning 😂",
    // content: JSON.stringify(aiReply),
  })
  socket.emit(events.new, {
    conversation,
    messages: [starterMessage, newUserMessage, aiMessage].filter((it) =>
      Boolean(it)
    ),
  })
})

const getMultipleMessagesHandler = socketTryCatcher(
  async (_io, socket, data = {}) => {
    const messages = await getMultipleMessages({
      conversation: data.conversationId,
      userId: socket.user._id.toString(),
      query: {
        page: data.page || 1,
        limit: data.limit || 100,
        sort: data.sort || "-createdAt",
      },
    })
    socket.emit(events.getMany, {
      conversationId: data.conversationId,
      messages,
      count: messages.length,
      hasMore:
        typeof data.limit === "number"
          ? data.limit === messages.length
          : messages.length === 100,
      page: data.page || 1,
    })
  }
)

const getInitMessageHandler = socketTryCatcher(
  async (_io, socket, data = {}) => {
    const { conversationId } = data
    // get message from ai prompting user to ask for assistance
    const message = await createDefaultStarterMessage(socket, conversationId)
    socket.emit(events.initMessage, { message })
  }
)

module.exports.eventHandlers = {
  [events.new]: newMessagesHandler,
  [events.getMany]: getMultipleMessagesHandler,
  [events.initMessage]: getInitMessageHandler,
}
