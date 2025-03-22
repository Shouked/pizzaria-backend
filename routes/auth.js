const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Usuário não encontrado para email:', email);
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Senha incorreta para email:', email);
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    const payload = {
      user: {
        id: user.id,
        isAdmin: user.isAdmin, // Adiciona isAdmin ao token
        tenantId: user.tenantId, // Adiciona tenantId ao token
      },
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Token gerado para usuário:', user.id, 'com payload:', payload);

    res.json({ token, user: user.toJSON() });
  } catch (err) {
    console.error('Erro no login:', err.message);
    res.status(500).send('Erro no servidor');
  }
});

// Registro
router.post('/register', async (req, res) => {
  const { name, phone, address, email, password, tenantId } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      console.log('Usuário já existe para email:', email);
      return res.status(400).json({ message: 'Usuário já existe' });
    }

    user = new User({
      name,
      phone,
      address,
      email,
      password,
      tenantId,
      isAdmin: false, // Define como false por padrão no registro
    });

    await user.save();
    console.log('Usuário registrado:', user.id);

    const payload = {
      user: {
        id: user.id,
        isAdmin: user.isAdmin, // Adiciona isAdmin ao token
        tenantId: user.tenantId, // Adiciona tenantId ao token
      },
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user: user.toJSON() });
  } catch (err) {
    console.error('Erro no registro:', err.message);
    res.status(500).send('Erro no servidor');
  }
});

// Pegar usuário autenticado
router.get('/me', auth, async (req, res) => {
  try {
    console.log('Buscando usuário com ID:', req.user.id);
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      console.log('Usuário não encontrado para ID:', req.user.id);
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json(user);
  } catch (err) {
    console.error('Erro ao buscar usuário:', err.message);
    res.status(500).send('Erro no servidor');
  }
});

// Atualizar perfil
router.put('/me', auth, async (req, res) => {
  const { name, email, phone, address, tenantId } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    user.tenantId = tenantId || user.tenantId;

    await user.save();
    console.log('Perfil atualizado para usuário:', user.id);
    res.json(user);
  } catch (err) {
    console.error('Erro ao atualizar perfil:', err.message);
    res.status(500).send('Erro no servidor');
  }
});

// Alterar senha
router.put('/password', auth, async (req, res) => {
  const { password } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    user.password = password;
    await user.save();
    console.log('Senha alterada para usuário:', user.id);
    res.json({ message: 'Senha alterada com sucesso' });
  } catch (err) {
    console.error('Erro ao alterar senha:', err.message);
    res.status(500).send('Erro no servidor');
  }
});

module.exports = router;