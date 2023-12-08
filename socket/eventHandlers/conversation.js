const {
  createConversation,
  getMultipleConversations,
} = require("../../controllers/conversation")
const { socketTryCatcher } = require("../../utils/controllers")

const events = {
  new: "new",
  getMany: "getMany",
}

const createConversationHandler = socketTryCatcher(
  async (_io, socket, data) => {
    const newConversationData = {
      participants: [socket.user._id.toString()],
      title: data?.title || "",
    }
    const conversation = await createConversation(newConversationData)
    socket.emit(events.new, { conversation })
  }
)

const getManyConversationsHandler = socketTryCatcher(
  async (_io, socket, data = {}) => {
    const conversations = await getMultipleConversations({
      userId: socket.user._id.toString(),
      query: { page: data.page | 1, limit: data.limit | 100 },
    })
    socket.emit(events.getMany, {
      conversations,
      count: conversations.length,
      hasMore:
        typeof data.limit === "number"
          ? data.limit === conversations.length
          : conversations.length === 100,
    })
  }
)

module.exports = {
  [events.new]: createConversationHandler,
  [events.getMany]: getManyConversationsHandler,
}
