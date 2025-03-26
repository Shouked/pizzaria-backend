const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const tenantMiddleware = require('../middleware/tenant');

router.post('/:tenantId/login', tenantMiddleware, authController.login);
router.post('/:tenantId/register', tenantMiddleware, authController.register);
router.get('/me', authMiddleware, authController.getMe);

// Nova rota adicionada, mas possivelmente na ordem errada ou com middleware
router.post('/superadmin/login', authController.superAdminLogin);

module.exports = router;
