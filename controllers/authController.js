const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Registro de admin comum
const register = async (req, res) => {
  const { name, email, password } = req.body;
  const tenantId = req.params.tenantId;

  if (!name || !email || !password || !tenantId) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  try {
    const existingUser = await User.findOne({ email, tenantId });
    if (existingUser) {
      return res.status(400).json({ message: 'Usuário já existe com este e-mail para esta pizzaria' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      tenantId,
      isAdmin: true
    });

    await newUser.save();
    res.status(201).json({ message: 'Usuário registrado com sucesso!' });
  } catch (error) {
    console.error('Erro ao registrar:', error.message);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

module.exports = {
  register,
  login,
  superAdminLogin,
  getMe
};