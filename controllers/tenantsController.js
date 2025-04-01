const Tenant = require('../models/Tenant');

// GET /api/tenants - Listar todos os tenants (super admin)
exports.getAllTenants = async (req, res) => {
  try {
    const tenants = await Tenant.find().sort({ createdAt: -1 });
    res.json(tenants);
  } catch (err) {
    console.error('Erro ao buscar tenants:', err.message);
    res.status(500).json({ message: 'Erro ao buscar pizzarias' });
  }
};

// GET /api/tenants/:tenantId - Buscar tenant por ID
exports.getTenantById = async (req, res) => {
  try {
    const tenant = await Tenant.findOne({ tenantId: req.params.tenantId });
    if (!tenant) {
      return res.status(404).json({ message: 'Pizzaria não encontrada' });
    }
    res.json(tenant);
  } catch (err) {
    console.error('Erro ao buscar pizzaria:', err.message);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

// POST /api/tenants - Criar novo tenant
exports.createTenant = async (req, res) => {
  let {
    tenantId,
    name,
    logoUrl,
    primaryColor,
    secondaryColor,
    phone,
    address
  } = req.body;

  try {
    if (!tenantId || !name) {
      return res.status(400).json({ message: 'TenantId e nome são obrigatórios' });
    }

    tenantId = tenantId.trim().toLowerCase().replace(/\s/g, '').replace(/[^a-z0-9]/g, '');

    if (!/^[a-z0-9]+$/.test(tenantId)) {
      return res.status(400).json({ message: 'TenantId inválido. Use apenas letras e números' });
    }

    const existing = await Tenant.findOne({ tenantId });
    if (existing) {
      return res.status(400).json({ message: 'Já existe uma pizzaria com esse TenantId' });
    }

    const newTenant = new Tenant({
      tenantId,
      name,
      logoUrl,
      primaryColor,
      secondaryColor,
      phone,
      address
    });

    await newTenant.save();
    res.status(201).json(newTenant);
  } catch (err) {
    console.error('Erro ao criar pizzaria:', err.message);
    res.status(500).json({ message: 'Erro ao criar pizzaria' });
  }
};

// PUT /api/tenants/:tenantId - Atualizar tenant (super admin)
exports.updateTenant = async (req, res) => {
  try {
    const updates = req.body;

    const updated = await Tenant.findOneAndUpdate(
      { tenantId: req.params.tenantId },
      updates,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Pizzaria não encontrada' });
    }

    res.json(updated);
  } catch (err) {
    console.error('Erro ao atualizar pizzaria:', err.message);
    res.status(500).json({ message: 'Erro ao atualizar pizzaria' });
  }
};

// PUT direto para admin comum
exports.updateTenantDirect = async (tenantId, updates) => {
  return await Tenant.findOneAndUpdate({ tenantId }, updates, { new: true });
};

// DELETE /api/tenants/:tenantId - Deletar tenant
exports.deleteTenant = async (req, res) => {
  try {
    const deleted = await Tenant.findOneAndDelete({ tenantId: req.params.tenantId });

    if (!deleted) {
      return res.status(404).json({ message: 'Pizzaria não encontrada' });
    }

    res.json({ message: 'Pizzaria deletada com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar pizzaria:', err.message);
    res.status(500).json({ message: 'Erro ao deletar pizzaria' });
  }
};