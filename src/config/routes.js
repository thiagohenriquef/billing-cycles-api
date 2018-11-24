const express = require('express')
const auth = require('./auth')
const billingCycle = require('../api/billingCycle/billingCycleService')
const authService = require('../api/user/authService')

const middleware = app => {
  // protected routes
  const protectedApi = express.Router()
  app.use('/api', protectedApi)
  
  protectedApi.use(auth)
  billingCycle.register(protectedApi, '/billingCycle')

  // open routes
  const openApi = express.Router()
  app.use('/oapi', openApi)

  openApi.post('/login', authService.login)
  openApi.post('/signUp', authService.signUp)
  openApi.post('/validateToken', authService.validateToken)
}

module.exports = middleware