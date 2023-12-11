const { joinCommunity, leaveCommunity } = require("../../controllers/community")

const { socketTryCatcher } = require("../../utils/controllers")

const events = {
  join: "join",
  leave: "leave",
  message: "message",
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
  }
)

module.exports = {
  [events.join]: joinCommunityEventHandler,
  [events.leave]: leaveCommunityEventHandler,
  [events.initMessage]: getInitMessageHandler,
}
