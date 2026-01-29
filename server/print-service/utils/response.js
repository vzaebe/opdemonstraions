/**
 * Standardized API response helpers
 */

function success(res, data = null, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  })
}

function created(res, data = null, message = 'Created') {
  return success(res, data, message, 201)
}

function error(res, message = 'An error occurred', statusCode = 500, details = null) {
  return res.status(statusCode).json({
    success: false,
    error: message,
    details,
  })
}

function badRequest(res, message = 'Bad request', details = null) {
  return error(res, message, 400, details)
}

function unauthorized(res, message = 'Unauthorized') {
  return error(res, message, 401)
}

function forbidden(res, message = 'Forbidden', details = null) {
  return error(res, message, 403, details)
}

function notFound(res, message = 'Not found') {
  return error(res, message, 404)
}

function unprocessableEntity(res, message = 'Unprocessable entity', details = null) {
  return error(res, message, 422, details)
}

function tooManyRequests(res, message = 'Too many requests') {
  return error(res, message, 429)
}

module.exports = {
  success,
  created,
  error,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  unprocessableEntity,
  tooManyRequests,
}
