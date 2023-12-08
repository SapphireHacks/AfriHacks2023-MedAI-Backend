

const conversationEventHandlers = require('./eventHandlers/conversation')
const  messageEventHandlers = require('./eventHandlers/message')

const namespacesSrc = {
  conversations: '/conversations',
  messages: '/messages',
}

module.exports.namespacesEventsHandlers = {
  [namespacesSrc.conversations]: conversationEventHandlers,
  [namespacesSrc.messages]: messageEventHandlers,
}

module.exports.namespaces = Object.values(namespacesSrc)
