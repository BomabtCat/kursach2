const authService = require("../services/authService");
const config = require("../config/env");
const asyncHandler = require("../utils/asyncHandler");

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: config.nodeEnv === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000
};

const setRefreshCookie = (res, token) => {
  res.cookie(config.refreshCookieName, token, cookieOptions);
};

const register = asyncHandler(async (req, res) => {
  const data = await authService.register(req.body);
  setRefreshCookie(res, data.refreshToken);
  res.status(201).json({ success: true, data: { accessToken: data.accessToken, user: data.user } });
});

const login = asyncHandler(async (req, res) => {
  const data = await authService.login(req.body);
  setRefreshCookie(res, data.refreshToken);
  res.json({ success: true, data: { accessToken: data.accessToken, user: data.user } });
});

const refresh = asyncHandler(async (req, res) => {
  const data = await authService.refresh(req.cookies[config.refreshCookieName]);
  setRefreshCookie(res, data.refreshToken);
  res.json({ success: true, data: { accessToken: data.accessToken, user: data.user } });
});

const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.cookies[config.refreshCookieName]);
  res.clearCookie(config.refreshCookieName, cookieOptions);
  res.json({ success: true, data: null });
});

const me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user });
});

module.exports = { register, login, refresh, logout, me };
