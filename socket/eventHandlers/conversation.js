const {
  createConversation,
  getMultipleConversations,
  deleteMultipleConversations,
  deleteSingleConversationById,
} = require("../../controllers/conversation")
const { socketTryCatcher } = require("../../utils/controllers")

const events = {
  new: "new",
  getMany: "getMany",
  deleteOne: "deleteOne",
  deleteAll: "deleteAll",
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
const deleteAllUserConversations = socketTryCatcher(async (_io, socket) => {
  await deleteMultipleConversations({
    participants: {
      $in: socket.user._id.toString(),
    },
  })
  socket.emit(events.deleteAll, {
    done: true,
    message: "Successfully cleared history!",
  })
})

const deleteOneConversationHandler = socketTryCatcher(
  async (_io, socket, data) => {
    await deleteSingleConversationById(data.conversationId)
    socket.emit(events.deleteOne, {
      done: true,
      message: "Successfully deleted conversation!",
      conversationId: data.conversationId,
    })
  }
)

module.exports.eventHandlers = {
  [events.new]: createConversationHandler,
  [events.getMany]: getManyConversationsHandler,
  [events.deleteOne]: deleteOneConversationHandler,
  [events.deleteAll]: deleteAllUserConversations,
}
