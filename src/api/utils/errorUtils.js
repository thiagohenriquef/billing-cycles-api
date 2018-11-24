const _ = require('lodash')

const sendErrorsFromDB = (res, dbErrors) => {
  const errors = []
  _.forIn(dbErrors.errors, error => errors.push(error.message))
  return res.status(400).json({errors})
}

const handleError = (res, message = '', status = 403) => {
  return res.status(status).send({
    errors: [message]
  })
}

module.exports = { sendErrorsFromDB, handleError }