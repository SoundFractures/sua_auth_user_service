const Auth = require("../services/auth");
async function authMiddleware(req, res, next) {
  await Auth.checkUserToken(req)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((error) => {
      return res.status(403).json({
        response: error,
      });
    });
}

module.exports = [authMiddleware];
