const express = require('express');
const router = express.Router();
const { createProxyMiddleware } = require('http-proxy-middleware');
const services = require('../config/services');
const authenticate = require('../middlewares/auth');

router.use('/', createProxyMiddleware({
  target: services.authService.baseUrl,
  changeOrigin: true,
  pathRewrite: { '^/api/auth': '' }
}));

module.exports = router;