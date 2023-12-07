module.exports = function sendResponse(req, res, next) {
  res.json(req.response || {}).status(req.response?.status || 500)
}
