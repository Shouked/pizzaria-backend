const express = require('express');
const router = express.Router();
const Tenant = require('../models/Tenant');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Criar uma nova pizzaria (apenas admin)
router.post('/', [auth, adminAuth], async (req, res) => {
  try {
    const { tenantId, name, description } = req.body;
    
    if (!tenantId || !name) {
      return res.status(400).json({ message: 'tenantId e name são obrigatórios.' });
    }

    const existingTenant = await Tenant.findOne({ tenantId });
    if (existingTenant) {
      return res.status(400).json({ message: 'Este tenantId já está em uso.' });
    }

    const tenant = new Tenant({ tenantId, name, description });
    await tenant.save();
    res.status(201).json(tenant);
  } catch (err) {
    console.error('Erro ao criar tenant:', err);
    res.status(500).json({ message: 'Erro ao criar pizzaria.' });
  }
});

// Listar todas as pizzarias (apenas admin)
router.get('/', [auth, adminAuth], async (req, res) => {
  try {
    const tenants = await Tenant.find();
    res.json(tenants);
  } catch (err) {
    console.error('Erro ao listar tenants:', err);
    res.status(500).json({ message: 'Erro ao listar pizzarias.' });
  }
});

module.exports = router;
