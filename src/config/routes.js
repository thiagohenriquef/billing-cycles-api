const router = require('express').Router()

module.exports = app => {
  app.use('/api', router)

  const billingCycle = require('../api/billingCycleService')
  billingCycle.register(router, '/billingCycle')
}