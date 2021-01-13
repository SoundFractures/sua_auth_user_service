const jwt = require("jsonwebtoken");
require("dotenv").config();

async function checkUserToken(req) {
  let token = null;
  return await new Promise((resolve, reject) => {
  try {
    if (req.body.token) {
      token = req.body.token;
    } else {
      const header = req.headers["authorization"];
      token = header && header.split(" ")[1];
    }
  }
  catch {
    reject("Token not found");
  }
  

  
    if (!token) reject("Token not found");

    jwt.verify(
      token,
      "sua2020-spoooooooky_key-or_should_i_say-SpooooKey-:D",
      (error, user) => {
        if (error) reject("Token invalid");
        resolve(user.id);
      }
    );
  });
}
module.exports = {
  checkUserToken
};