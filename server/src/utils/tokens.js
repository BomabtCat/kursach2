const jwt = require("jsonwebtoken");
const config = require("../config/env");

const signAccessToken = (user) =>
  jwt.sign({ id: user._id, username: user.username, role: user.role }, config.jwtAccessSecret, {
    expiresIn: config.accessTokenTtl
  });

const signRefreshToken = (user) =>
  jwt.sign({ id: user._id }, config.jwtRefreshSecret, { expiresIn: config.refreshTokenTtl });

module.exports = { signAccessToken, signRefreshToken };
