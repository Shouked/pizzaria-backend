const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');

router.post('/register', async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Usuário já existe.' });
    }

    user = new User({ name, email, password, phone });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error.message, error.stack);
    res.status(500).json({ message: 'Erro ao registrar usuário.', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log('Tentativa de login com:', { email });

  try {
    const user = await User.findOne({ email });
    console.log('Usuário encontrado:', user ? user._id : 'Nenhum usuário encontrado');

    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    // Verificar se user tem o método comparePassword
    if (typeof user.comparePassword !== 'function') {
      console.error('comparePassword não é uma função no objeto user:', user);
      throw new Error('Modelo User não carregado corretamente.');
    }

    const isMatch = await user.comparePassword(password);
    console.log('Senha válida:', isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Token gerado para usuário:', user._id);
    res.json({ token });
  } catch (error) {
    console.error('Erro ao fazer login:', error.message, error.stack);
    res.status(500).json({ message: 'Erro ao fazer login.', error: error.message });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });
    res.json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error.message, error.stack);
    res.status(500).json({ message: 'Erro ao buscar usuário.', error: error.message });
  }
});

router.put('/me', authMiddleware, async (req, res) => {
  const { name, email, phone } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, phone },
      { new: true, runValidators: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });
    res.json(user);
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error.message, error.stack);
    res.status(400).json({ message: 'Erro ao atualizar perfil.', error: error.message });
  }
});

router.put('/password', authMiddleware, async (req, res) => {
  const { password } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });
    user.password = password; // Será hasheado pelo middleware pre-save
    await user.save();
    res.status(200).json({ message: 'Senha atualizada com sucesso.' });
  } catch (error) {
    console.error('Erro ao atualizar senha:', error.message, error.stack);
    res.status(400).json({ message: 'Erro ao atualizar senha.', error: error.message });
  }
});

module.exports = router;
