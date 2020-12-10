const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Auth = require("../services/auth");
const User = require("../models/User");

/**
 * @swagger
 * /api/auth/verify:
 *  get:
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
router.get("/verify", (req, res) => {
  Auth.checkUserToken(req)
    .then((user) => {
      User.findOne({
        _id: user.id,
      })
        .then((user) => {
          console.log(user.id);
          res.status(200).json({ response: user.id });
        })
        .catch((error) =>
          res.status(404).json({
            response: "User couldn't be collected",
          })
        );
    })
    .catch((error) => {
      return res.status(403).json({
        response: error,
      });
    });
});

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
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(req);
  if (!email || !password)
    return res.status(400).json({
      response: "Email or Password not provided",
    });

  await User.findOne({
    email: email,
  }).then((user) => {
    if (!user)
      return res.status(400).json({
        response: "Email does not exsist",
      });
    bcrypt.compare(password, user.password).then((equal) => {
      if (!equal)
        return res.status(400).json({
          response: "Wrong Email or Password",
        });

      jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        "sua2020-spoooooooky_key-or_should_i_say-SpooooKey-:D",
        { expiresIn: 3600 },
        (error, token) => {
          if (error) throw error;
          res.send({
            token: token,
          });
        }
      );
    });
  });
});
module.exports = router;
