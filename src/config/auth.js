const jwt = require('jsonwebtoken')
const env = require('../.env')
const handleError = require('../api/utils/errorUtils').handleError

const validateSentToken = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    next()
    return
  }

  const token = req.body.token || req.query.token || req.headers['authorization']
  if (!token) {
    handleError(res, 'No token provided.')
  }
  jwt.verify(token, env.authSecret, (err, decoded) => {
    if (err) {
      return handleError(res, 'Failed to authenticate token.')
    }
    req.decoded = decoded
    next()
  })
}

module.exports = validateSentToken

