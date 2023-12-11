const {
  joinCommunity,
  leaveCommunity,
  getSingleCommunityById,
} = require("../../controllers/community")
const {
  createCommunityMessage,
  getMultipleCommunityMessages,
} = require("../../controllers/communityMessage")
const {
  getAllCommunityMembers,
  getAllUserMemberships,
} = require("../../controllers/membership")
const { socketTryCatcher } = require("../../utils/controllers")

const events = {
  join: "join",
  leave: "leave",
  message: "message",
  typing: "typing",
}

const joinCommunityEventHandler = socketTryCatcher(
  async (_io, socket, data = {}) => {
    const { communityId } = data
    const membership = await joinCommunity({
      community: communityId,
      member: socket.user._id.toString(),
    })
    socket.emit("join", {
      membership,
      message: "You are now a member!",
    })
    socket.join(data.communityId)
    socket.to(data.communityId).emit("join", {
      info: `${socket.user.firstName} just joined the community.`,
      communityId,
    })
  }
)

const leaveCommunityEventHandler = socketTryCatcher(
  async (_io, socket, data = {}) => {
    const { communityId } = data
    const membership = await leaveCommunity({
      community: communityId,
      member: socket.user._id.toString(),
    })
    socket.leave(communityId)
    socket.emit("leave", {
      membership,
      message: "You are no longer a member!",
    })
  }
)

const messageCommunityEventHandler = socketTryCatcher(
  async (_io, socket, data = {}) => {
    const { message, communityId } = data
    const community = await getSingleCommunityById(communityId)
    const newMessage = await createCommunityMessage({
      communityId,
      sender: socket.user._id,
      recipients: await getAllCommunityMembers(communityId),
      message,
    })
    const dataToEmit = {
      message: newMessage,
      info: `${socket.user.firstName} just sent dropped message in ${community.name}`,
    }
    socket.emit("message", dataToEmit)
    socket.broadcast.to(communityId).emit("message", dataToEmit)
  }
)

const typingEventHandler = socketTryCatcher(async (_io, socket, data = {}) => {
  socket.broadcast.to(data.communityId).emit("typing", {
    user: socket.user,
    isTyping: data.isTyping
  })
})

module.exports.comeOnlineHandler = socketTryCatcher(async (io, socket) => {
  const usersMemberships = await getAllUserMemberships(
    socket.user._id.toString()
  )
  usersMemberships.forEach((membership) =>
    socket.join(membership.community.toString())
  )
  socket.emit("online", {
    communities: usersMemberships,
  })
})

module.exports.eventHandlers = {
  [events.join]: joinCommunityEventHandler,
  [events.leave]: leaveCommunityEventHandler,
  [events.message]: messageCommunityEventHandler,
  [events.typing]: typingEventHandler,
  // [events.online]: module.exports.comeOnlineHandler,
}
