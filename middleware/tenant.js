const Tenant = require('../models/Tenant');

exports.getAllTenants = async (req, res) => {
  try {
    console.log('Iniciando getAllTenants para super admin');
    console.log('req.user:', req.user);
    console.log('Buscando todos os tenants no banco');
    const tenants = await Tenant.find();
    console.log('Tenants encontrados:', tenants);
    if (!tenants || tenants.length === 0) {
      console.log('Nenhum tenant encontrado');
      return res.status(200).json([]);
    }
    console.log('Retornando tenants:', tenants);
    res.json(tenants);
  } catch (error) {
    console.error('Erro ao buscar tenants:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ message: 'Erro ao carregar pizzarias', error: error.message });
  }
};
