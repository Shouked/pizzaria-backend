const Tenant = require('../models/Tenant');

// GET /api/tenants - Listar todos os tenants (apenas superAdmin)
exports.getAllTenants = async (req, res) => {
  try {
    const tenants = await Tenant.find().sort({ createdAt: -1 });
    res.json(tenants);
  } catch (err) {
    console.error('Erro ao buscar tenants:', err.message);
    res.status(500).send('Erro no servidor');
  }
};

// GET /api/tenants/:tenantId - Buscar tenant por tenantId
exports.getTenantById = async (req, res) => {
  try {
    const tenant = await Tenant.findOne({ tenantId: req.params.tenantId });
    if (!tenant) {
      return res.status(404).json({ msg: 'Tenant não encontrado' });
    }
    res.json(tenant);
  } catch (err) {
    console.error('Erro ao buscar tenant:', err.message);
    res.status(500).send('Erro no servidor');
  }
};

// POST /api/tenants - Criar novo tenant (somente superAdmin)
exports.createTenant = async (req, res) => {
  let {
    tenantId,
    name,
    logoUrl,
    primaryColor,
    secondaryColor,
    phone,
    address // { cep, street, number }
  } = req.body;

  try {
    if (!tenantId || !name) {
      return res.status(400).json({ msg: 'TenantId e nome são obrigatórios' });
    }

    tenantId = tenantId
      .trim()
      .toLowerCase()
      .replace(/\s/g, '')
      .replace(/[^a-z0-9]/g, '');

    if (!/^[a-z0-9]+$/.test(tenantId)) {
      return res.status(400).json({ msg: 'TenantId inválido. Use apenas letras e números, sem espaços ou acentos.' });
    }

    const existing = await Tenant.findOne({ tenantId });
    if (existing) {
      return res.status(400).json({ msg: 'Já existe uma pizzaria com esse TenantId.' });
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
    console.error('Erro ao criar tenant:', err.message);
    res.status(500).send('Erro no servidor');
  }
};

// PUT /api/tenants/:tenantId - Atualizar tenant
exports.updateTenant = async (req, res) => {
  try {
    const updates = req.body;

    const updated = await Tenant.findOneAndUpdate(
      { tenantId: req.params.tenantId },
      updates,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ msg: 'Tenant não encontrado' });
    }

    res.json(updated);
  } catch (err) {
    console.error('Erro ao atualizar tenant:', err.message);
    res.status(500).send('Erro no servidor');
  }
};

// DELETE /api/tenants/:tenantId - Deletar tenant
exports.deleteTenant = async (req, res) => {
  try {
    const deleted = await Tenant.findOneAndDelete({ tenantId: req.params.tenantId });

    if (!deleted) {
      return res.status(404).json({ msg: 'Tenant não encontrado' });
    }

    res.json({ msg: 'Tenant deletado com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar tenant:', err.message);
    res.status(500).send('Erro no servidor');
  }
};