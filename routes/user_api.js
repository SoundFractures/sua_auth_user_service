const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const authMiddleware = require("../middleware/authMiddleware");

const User = require("../models/User");

/**
 * @swagger
 * /api/user/:
 *  get:
 *    parameters:
 *    - name: Token
 *
 *    description: Gets current user
 *    responses:
 *      '200':
 *        description: User Object
 */
router.get("/", authMiddleware, async (req, res) => {
  await User.findOne({
    _id: req.user.id,
  })
    .then((user) =>
      res.status(200).json({
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      })
    )
    .catch((error) =>
      res.status(404).json({
        response: "User couldn't be collected",
      })
    );
});

/**
 * @swagger
 * /api/user/create:
 *  post:
 *    parameters:
 *    - name: username
 *    - name: email
 *    - name: password
 *
 *    description: Register funcionality
 *    responses:
 *      '200':
 *        description: User Registered
 */
router.post("/create", async (req, res) => {
  const { username, email, password } = req.body;

  // Chech if inputs are empty
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ response: "Username, Email or Password not specified" });
  }

  //Check if user exsists, if not register
  await User.findOne({ email }).then((user) => {
    if (user) return res.status(400).json({ response: "User already exsists" });

    const newUser = new User({
      email,
      username,
      password,
    });

    bcrypt.genSalt((error, salt) => {
      bcrypt.hash(newUser.password, salt, (error, hash) => {
        if (error) throw error;
        newUser.password = hash;
        newUser.save().then((user) => {
          res.status(200).json({
            response: "Register successful",
          });
        });
      });
    });
  });
});

/**
 * @swagger
 * /api/user/:
 *  put:
 *    parameters:
 *    - name: username
 *    - name: email
 *
 *    description: Updateds user information
 *    responses:
 *      '200':
 *        description: User info updated
 */
router.put("/", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id).catch((error) => {
    return res.status(404).json({
      response: "User of that ID not found",
    });
  });
  user.username = req.body.username || user.username;
  user.email = req.body.email || user.email;

  if (req.body.password) {
    console.log(req.body.password);
    await bcrypt.genSalt((error, salt) => {
      bcrypt.hash(req.body.password, salt, (error, hash) => {
        if (error) throw error;
        console.log(hash);
        user.password = hash;
      });
    });
  }
  await User.updateOne({ _id: user._id }, user).catch((error) => {
    return res.status(400).json({ response: "User couldn't be updated" });
  });
  return res.status(200).json({
    response: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
});

/**
 * @swagger
 * /api/user/:
 *  delete:
 *    parameters:
 *    - name: token
 *
 *    description: Deletes current user
 *    responses:
 *      '200':
 *        description: User Deleted
 */
router.delete("/", authMiddleware, async (req, res) => {
  await User.findById(req.user.id)
    .then((user) =>
      user.remove().then(() =>
        res.json({
          response: "User deleted successfully.",
        })
      )
    )
    .catch((error) =>
      res.status(404).json({
        response: "User of that ID not found.",
      })
    );
});
module.exports = router;
