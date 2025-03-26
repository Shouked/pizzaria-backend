// ✅ REVISÃO COMPLETA DOS ARQUIVOS DE LOGIN E REGISTRO

const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const tenantMiddleware = require('../middleware/tenant');

// Login do super admin (sem tenantId)
router.post('/superadmin/login', authController.superAdminLogin);

// Login normal com tenantId (ex: /pizza-bia/login)
router.post('/:tenantId/login', tenantMiddleware, authController.login);

// Registro com tenantId na URL
router.post('/:tenantId/register', tenantMiddleware, authController.register);

// Obter perfil do usuário autenticado
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
