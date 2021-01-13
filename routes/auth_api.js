const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const Auth = require('../services/auth')
const User = require('../models/User')

/**
 * @swagger
 * /api/auth/verify:
 *  post:
 *    parameters:
 *    - name: Token
 *      description: The AUTH header token of type Bearer
 *    description: Main auth middleware for other services
 *    responses:
 *      '200':
 *        description: User ID (Number)
 *      '403':
 *        description: Token Invalid
 */
router.post('/verify', (req, res) => {
  Auth.checkUserToken(req)
    .then((user) => {
      User.findOne({
        _id: user
      })
        .then((user) => {
          res.messageType = 'INFO'
          res.message = 'Verification successful'
          res.status(200).json({ response: user._id })
        })
        .catch((error) => {
          res.message = "User couldn't be collected"
          res.messageType = 'ERROR'
          res.status(404).json({
            response: "User couldn't be collected"
          })
        })
    })
    .catch((error) => {
      res.messageType = 'ERROR'
      res.message = 'User access forbidden'
      return res.status(403).json({
        response: error
      })
    })
})

/**
 * @swagger
 * /api/auth/login:
 *  post:
 *    parameters:
 *    - name: username
 *    - name: password
 *
 *    description: Login funcionality
 *    responses:
 *      '200':
 *        description: Token
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    res.messageType = 'WARN'
    res.message = 'Email or Password not provided'
    return res.status(400).json({
      response: 'Email or Password not provided'
    })
  }

  await User.findOne({
    email: email
  }).then((user) => {
    if (!user) {
      res.messageType = 'WARN'
      res.message = 'Email does not exsist'
      return res.status(400).json({
        response: 'Email does not exsist'
      })
    }
    bcrypt.compare(password, user.password).then((equal) => {
      if (!equal) {
        res.messageType = 'WARN'
        res.message = 'Wrong Email or Password'
        return res.status(400).json({
          response: 'Wrong Email or Password'
        })
      }

      jwt.sign(
        {
          id: user.id,
          email: user.email
        },
        'sua2020-spoooooooky_key-or_should_i_say-SpooooKey-:D',
        { expiresIn: 7200 },
        (error, token) => {
          if (error) throw error
          res.messageType = 'INFO'
          res.message = 'Login successful'
          res.send({
            token: token
          })
        }
      )
    })
  })
})
module.exports = router
