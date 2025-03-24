const tenantMiddleware = async (req, res, next) => {
  try {
    const tenantIdFromUrl = req.params.tenantId;
    const tenantIdFromHeader = req.headers['x-tenant-id'];
    const tenantIdFromToken = req.user?.tenantId;

    const tenantId = tenantIdFromUrl || tenantIdFromHeader || tenantIdFromToken;

    if (!tenantId) {
      return res.status(400).json({ message: 'Tenant ID is required' });
    }

    // Aqui é a correção principal!
    const tenant = await Tenant.findOne({ tenantId });

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    req.tenant = tenant;
    next();
  } catch (error) {
    console.error('Error in tenantMiddleware:', error);
    res.status(500).json({ message: 'Server error in tenant middleware' });
  }
};

module.exports = tenantMiddleware;
