const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const config = require("../config/env");
const ApiError = require("../utils/ApiError");
const { signAccessToken, signRefreshToken } = require("../utils/tokens");

const publicUser = (user) => ({
  id: user._id,
  username: user.username,
  role: user.role,
  status: user.status
});

const saveRefreshToken = async (user, refreshToken) => {
  user.refreshTokenHash = await bcrypt.hash(refreshToken, config.bcryptSaltRounds);
  await user.save();
};

const issueTokens = async (user) => {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  await saveRefreshToken(user, refreshToken);
  return { accessToken, refreshToken, user: publicUser(user) };
};

const register = async ({ username, password, role = "user" }) => {
  const exists = await User.findOne({ username, deletedAt: null });
  if (exists) throw new ApiError(400, "Пользователь уже существует");

  const hash = await bcrypt.hash(password, config.bcryptSaltRounds);
  const user = await User.create({ username, password: hash, role });
  return issueTokens(user);
};

const login = async ({ username, password }) => {
  const user = await User.findOne({ username, deletedAt: null, status: "active" });
  if (!user) throw new ApiError(401, "Неверный логин или пароль");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ApiError(401, "Неверный логин или пароль");

  return issueTokens(user);
};

const refresh = async (refreshToken) => {
  if (!refreshToken) throw new ApiError(401, "Refresh token отсутствует");

  let payload;
  try {
    payload = jwt.verify(refreshToken, config.jwtRefreshSecret);
  } catch (err) {
    throw new ApiError(401, "Refresh token недействителен или истек");
  }

  const user = await User.findById(payload.id);
  if (!user || !user.refreshTokenHash) throw new ApiError(401, "Сессия не найдена");

  const isMatch = await bcrypt.compare(refreshToken, user.refreshTokenHash);
  if (!isMatch) throw new ApiError(401, "Refresh token отозван");

  return issueTokens(user);
};

const logout = async (refreshToken) => {
  if (!refreshToken) return;
  try {
    const payload = jwt.verify(refreshToken, config.jwtRefreshSecret);
    await User.findByIdAndUpdate(payload.id, { refreshTokenHash: null });
  } catch (err) {
    return;
  }
};

module.exports = { register, login, refresh, logout, publicUser };
