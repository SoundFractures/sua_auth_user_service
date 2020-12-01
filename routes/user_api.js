const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const authMiddleware = require("../middleware/authMiddleware");

const User = require("../models/User");

// @route GET api/user
// @desc  Get a user
router.get("/", authMiddleware, (req, res) => {
  User.findOne({
    _id: req.user.id,
  })
    .then((user) => res.status(200).json({ response: user }))
    .catch((error) =>
      res.status(404).json({
        response: "User couldn't be collected.",
      })
    );
});

// @route POST api/user/create
// @desc  Register a user
router.post("/create", (req, res) => {
  const { email, password } = req.body;

  // Chech if inputs are empty
  if (!email || !password) {
    return res
      .status(400)
      .json({ response: "Email or Password not specified" });
  }

  //Check if user exsists, if not register and sign JWT
  User.findOne({ email }).then((user) => {
    if (user) return res.status(400).json({ response: "User already exsists" });

    const newUser = new User({
      email,
      password,
    });

    bcrypt.genSalt((error, salt) => {
      bcrypt.hash(newUser.password, salt, (error, hash) => {
        if (error) throw error;
        newUser.password = hash;
        newUser.save().then((user) =>
          jwt.sign(
            {
              id: user.id,
              email: user.email,
            },
            process.env.JWT_SPOOKY_SECRET,
            { expiresIn: 3600 },
            (error, token) => {
              if (error) throw error;
              res.send({
                id: user.id,
                email: user.email,
                token,
              });
            }
          )
        );
      });
    });
  });
});
module.exports = router;
