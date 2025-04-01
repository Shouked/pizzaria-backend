// middleware/auth.js const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => { const authHeader = req.headers.authorization; if (!authHeader || !authHeader.startsWith('Bearer ')) { return res.status(401).json({ message: 'Token não fornecido' }); }

const token = authHeader.split(' ')[1]; try { const decoded = jwt.verify(token, process.env.JWT_SECRET); req.user = decoded; next(); } catch (err) { console.error('Erro ao verificar token JWT:', err.message); return res.status(401).json({ message: 'Token inválido ou expirado' }); } };

module.exports = authMiddleware;

// middleware/superAdminAuth.js const superAdminAuthMiddleware = (req, res, next) => { if (!req.user?.isSuperAdmin) { return res.status(403).json({ message: 'Super admin access required' }); } next(); };

module.exports = superAdminAuthMiddleware;

// middleware/adminAuth.js const adminAuthMiddleware = (req, res, next) => { if (!req.user?.isAdmin) { return res.status(403).json({ message: 'Admin access required' }); } next(); };

module.exports = adminAuthMiddleware;

// middleware/tenant.js const Tenant = require('../models/Tenant');

const tenantMiddleware = async (req, res, next) => { console.log('--- [Tenant Middleware] ---'); console.log('req.method:', req.method); console.log('req.path:', req.path); console.log('req.params:', req.params); console.log('req.user:', req.user);

if (req.user?.isSuperAdmin) { console.log('Usuário é super admin, ignorando validação de tenant'); return next(); }

let tenantId = null;

if (req.path === '/me' && req.user?.tenantId) { tenantId = req.user.tenantId; } else if (req.params?.tenantId) { tenantId = req.params.tenantId; } else if (req.user?.tenantId) { tenantId = req.user.tenantId; }

if (!tenantId) { console.log('Tenant ID não fornecido'); return res.status(400).json({ message: 'Tenant ID não fornecido' }); }

try { const tenant = await Tenant.findOne({ tenantId }); if (!tenant) { console.log('Tenant não encontrado no banco:', tenantId); return res.status(404).json({ message: 'Tenant não encontrado' }); }

req.tenant = tenant;
console.log('✅ Tenant encontrado:', tenant.tenantId);
next();

} catch (error) { console.error('Erro ao buscar tenant:', error); res.status(500).json({ message: 'Erro interno ao buscar tenant' }); } };

module.exports = tenantMiddleware;

