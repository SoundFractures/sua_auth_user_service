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
module.exports = router;
