const { eventHandlers: conversationEventHandlers } = require("./eventHandlers/conversation")
const { eventHandlers: messageEventHandlers } = require("./eventHandlers/message")
const { eventHandlers: communitiesEventHandlers, comeOnlineHandler } = require("./eventHandlers/communities")

const namespacesSrc = {
  conversations: "/conversations",
  messages: "/messages",
  communities: "/communities",
}

module.exports.namespacesEventsHandlers = {
  [namespacesSrc.conversations]: conversationEventHandlers,
  [namespacesSrc.messages]: messageEventHandlers,
  [namespacesSrc.communities]: communitiesEventHandlers,
}

module.exports.namespacesOnConnectHandlers = {
  [namespacesSrc.conversations]: () => {},
  [namespacesSrc.messages]: () => {},
  [namespacesSrc.communities]: comeOnlineHandler
}

module.exports.namespaces = Object.values(namespacesSrc)
