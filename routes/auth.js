const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const tenantMiddleware = require('../middleware/tenant');

router.post('/superadmin/login', authController.superAdminLogin);
router.post('/:tenantId/login', tenantMiddleware, authController.login);
router.post('/:tenantId/register', tenantMiddleware, authController.register);
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
