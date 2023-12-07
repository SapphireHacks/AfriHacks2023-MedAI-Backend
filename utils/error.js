

module.exports = class CustomError extends Error{
  constructor(message, statusCode = 500){
    super(message)
    this.message = message
    this.statusCode = statusCode
    this.status = statusCode.toString().startsWith('4') ? 'failed' : 'error',
    this.isOperational = true
		Error.captureStackTrace(this, this.constructor)
  }
}