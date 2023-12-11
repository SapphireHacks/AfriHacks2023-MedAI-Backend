const {
  joinCommunity,
  leaveCommunity,
  getAllMembersOfCommunity,
  getSingleCommunityById,
  getAllUsersCommunities,
} = require("../../controllers/community")
const {
  createCommunityMessage,
  getMultipleCommunityMessages,
} = require("../../controllers/communityMessage")
const { getAllCommunityMembers } = require("../../controllers/membership")

const { socketTryCatcher } = require("../../utils/controllers")

const events = {
  join: "join",
  leave: "leave",
  message: "message",
  online: "online",
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
  }
)

const leaveCommunityEventHandler = socketTryCatcher(
  async (_io, socket, data = {}) => {
    const { communityId } = data
    const membership = await leaveCommunity({
      community: communityId,
      member: socket.user._id.toString(),
    })
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
      recipients: await getAllMembersOfCommunity(communityId),
      message,
    })
    io.in(communityId).emit("message", {
      message: newMessage,
      info: `${socket.user.firstName} just sent dropped message in ${community.name}`,
    })
  }
)

const comeOnlineHandler = socketTryCatcher(
  async (_io, socket) => {
    const usersCommunities = await getAllUsersCommunities(communityId)
    await Promise.allResolved(usersCommunities.map(community => socket.join(community._id)))
    socket.emit("online", {
      communities: usersCommunities,
    })
  }
)

const typingEventHandler = socketTryCatcher(
  async (_io, socket, data = {}) => {
    socket.to(data.communityId).emit("typing", {
      typingUser: socket.user,
    })
  }
)
module.exports = {
  [events.join]: joinCommunityEventHandler,
  [events.leave]: leaveCommunityEventHandler,
  [events.initMessage]: messageCommunityEventHandler,
  [events.online]: comeOnlineHandler,
  [events.typing]: typingEventHandler,
}
