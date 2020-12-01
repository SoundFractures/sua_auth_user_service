const jwt = require("jsonwebtoken");
require("dotenv").config();

async function checkUserToken(req) {
  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1];

  return await new Promise((resolve, reject) => {
    if (!token) reject("Token not found.");

    jwt.verify(token, process.env.JWT_SPOOKY_SECRET, (error, user) => {
      if (error) reject("Token invalid");
      resolve(user);
    });
  });
}
module.exports = { checkUserToken };
