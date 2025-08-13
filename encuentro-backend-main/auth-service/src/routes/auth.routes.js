const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Rutas públicas
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.get('/validate', authController.validate);

module.exports = router;