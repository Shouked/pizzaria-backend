const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Tenant = require('../models/Tenant');

// Rotas existentes (register, login, getMe) permanecem iguais
// Adicionar nova função para login de superadmin
exports.superAdminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !user.isSuperAdmin) {
      return res.status(400).json({ msg: 'Credenciais inválidas ou não é superadmin' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciais inválidas' });
    }

    const payload = {
      userId: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
      isSuperAdmin: user.isSuperAdmin
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isSuperAdmin: user.isSuperAdmin
      }
    });
  } catch (err) {
    console.error('Erro no login do superadmin:', err.message);
    res.status(500).send('Erro no servidor');
  }
};

// Rotas existentes (register, login, getMe) continuam aqui
exports.register = async (req, res) => { /* ... */ };
exports.login = async (req, res) => { /* ... */ };
exports.getMe = async (req, res) => { /* ... */ };
