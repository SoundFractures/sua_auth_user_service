const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const authMiddleware = require("../middleware/authMiddleware");
const Auth = require("../services/auth");
const User = require("../models/User");

// @route GET api/auth/verify
// @desc  Main auth middleware for other services
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
            response: "User couldn't be collected.",
          })
        );
    })
    .catch((error) => {
      return res.status(403).json({
        response: error,
      });
    });
});

// @route GET api/auth/login
// @desc  Main auth middleware for other services
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({
      response: "Email or Password not provided.",
    });

  await User.findOne({
    email: email,
  }).then((user) => {
    if (!user)
      return res.status(400).json({
        response: "Email does not exsist.",
      });
    bcrypt.compare(password, user.password).then((equal) => {
      if (!equal)
        return res.status(400).json({
          response: "Wrong Email or Password.",
        });

      jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        process.env.JWT_SPOOKY_SECRET,
        (error, token) => {
          if (error) throw error;
          res.send({
            id: user.id,
            username: user.username,
            token: token,
          });
        }
      );
    });
  });
});
module.exports = router;
