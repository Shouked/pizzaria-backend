const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

console.log('✅ auth.js carregado em: ' + new Date().toISOString());

// Rota de login
router.post('/login', async (req, res) => {
  console.log('POST /auth/login chamado em: ' + new Date().toISOString());
  console.log('Body da requisição:', req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    console.log('Email ou senha não fornecidos');
    return res.status(400).json({ message: 'Email e senha são obrigatórios' });
  }

  try {
    console.log('Buscando usuário no banco para email:', email);
    const user = await User.findOne({ email });
    console.log('Usuário encontrado:', user);

    if (!user) {
      console.log('Usuário não encontrado');
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    console.log('Comparando senhas');
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Resultado da comparação de senhas:', isMatch);

    if (!isMatch) {
      console.log('Senha incorreta');
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    console.log('Gerando token JWT');
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        isAdmin: user.isAdmin || false,
        isSuperAdmin: user.isSuperAdmin || false,
        tenantId: user.tenantId || null,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log('Token gerado:', token);

    res.json({ token });
  } catch (error) {
    console.error('Erro ao fazer login:', error.message);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
});

// Log para todas as requisições
router.use((req, res, next) => {
  console.log('Rota requisitada no auth.js:', req.method, req.path, 'em: ' + new Date().toISOString());
  next();
});

module.exports = router;
