const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Login de Super Admin
const superAdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, isSuperAdmin: true });
    if (!user) return res.status(400).json({ message: 'Credenciais inválidas' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Credenciais inválidas' });

    const token = jwt.sign({
      userId: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
      isSuperAdmin: user.isSuperAdmin
    }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user });
  } catch (error) {
    console.error('Erro no superAdminLogin:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

// Login de usuário da pizzaria (admin ou cliente)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const tenantId = req.params.tenantId;

    const user = await User.findOne({ email, tenantId });
    if (!user) return res.status(400).json({ message: 'Credenciais inválidas' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Credenciais inválidas' });

    const token = jwt.sign({
      userId: user._id,
      email: user.email,
      tenantId: user.tenantId,
      isAdmin: user.isAdmin,
      isSuperAdmin: user.isSuperAdmin
    }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

// Registro de usuário comum (cliente)
const register = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    const tenantId = req.params.tenantId;

    if (!tenantId) return res.status(400).json({ message: 'TenantId é obrigatório' });

    const existingUser = await User.findOne({ email, tenantId });
    if (existingUser) return res.status(400).json({ message: 'E-mail já cadastrado nesta pizzaria' });

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      tenantId,
      isAdmin: false,
      isSuperAdmin: false
    });

    await newUser.save();
    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ message: 'Erro ao registrar usuário' });
  }
};

// Retorna dados do usuário logado
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
    res.json(user);
  } catch (error) {
    console.error('Erro no getMe:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

module.exports = {
  superAdminLogin,
  login,
  register,
  getMe
};