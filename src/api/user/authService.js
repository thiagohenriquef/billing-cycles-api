const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('./user')
const env = require('../../.env')
const sendErrorsFromDB = require('../utils/errorUtils').sendErrorsFromDB

const emailRegex = /\S+@\S+\.\S+/
const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})/

const login = (req, res, next) => {
  const email = req.body.email || ''
  const password = req.body.password || ''

  User.findOne({ email }, (err, user) => {
    if(err) {
      return sendErrorsFromDB(res, err)
    }
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign(user, env.authSecret, { expiresIn: '8h' })
      const { name, email } = user
      return res.json({ name, email, token })
    }
    return res.status(400).send({ errors: ['Invalid username / password']})
  })
}

const validateToken = (req, res, next) => {
  const token = req.body.token || ''
  jwt.verify(token, env.authSecret, (err, decoded) => {
    return res.status(200).send({ valid: !err })
  })
}

const signUp = (req, res, next) => {
  const name = req.body.name || ''
  const email = req.body.email || ''
  const password = req.body.password || ''
  const confirmPassword = req.body.confirm_password || ''

  if (!email.match(emailRegex)) {
    return res.status(400).send({ errors: ['Email is invalid.']})
  }

  if (!password.match(passwordRegex)) {
    return res.status(400).send({ errors: [
      'Password must have: a capital letter, a lowercase letter, a number, a special character (@ # $%) and size between 6-20.'
    ]})
  }

  const salt = bcrypt.genSaltSync()
  const passwordHash = bcrypt.hashSync(password, salt)
  if (!bcrypt.compareSync(confirmPassword, passwordHash)) {
    return res.status(400).send({errors: ['Passwords don\'t match.']})
  }

  User.findOne({ email }, (err, user) => {
    if (err) {
      return sendErrorsFromDB(res, err)
    }
    if (user) {
      return res.status(400).send({errors: ['User already registered.']})
    }
    const newUser = newUser({ name, email, password: passwordHash })
    newUser.save((err, user) => {
      if (err) {
        return sendErrorsFromDB(res, err)
      }
      login(res, req, next)
    })
  })
}

module.exports = { login, validateToken, signUp }