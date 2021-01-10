const jwt = require("jsonwebtoken");
require("dotenv").config();

async function checkUserToken(req) {
  let token = null;

  if (req.body.token) {
    token = req.body.token;
    console.log(token);
  } else {
    const header = req.headers["authorization"];
    token = header && header.split(" ")[1];
  }

  return await new Promise((resolve, reject) => {
    if (!token) reject("Token was not found.");

    jwt.verify(
      token,
      "sua2020-spoooooooky_key-or_should_i_say-SpooooKey-:D",
      (error, user) => {
        if (error) reject("Token invalid");
        resolve(user);
      }
    );
  });
}
module.exports = {
  checkUserToken
};