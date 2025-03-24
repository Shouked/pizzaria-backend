const Product = require('../models/Product');

// GET: Listar todos os produtos de um tenant
exports.getAllProducts = async (req, res) => {
  try {
    console.log('💡 [getAllProducts] req.tenant:', req.tenant);

    if (!req.tenant) {
      console.log('❌ Nenhum tenant detectado!');
      return res.status(400).json({ message: 'Tenant not resolved' });
    }

    const tenantId = req.tenant.tenantId; // Agora usamos o campo string
    console.log('🔍 Buscando produtos para tenantId:', tenantId);

    const products = await Product.find({ tenantId });

    console.log(`📦 Produtos encontrados: ${products.length}`);
    res.json(products);
  } catch (error) {
    console.error('❌ Erro ao buscar produtos:', error);
    res.status(500).json({ message: 'Server error while fetching products' });
  }
};

// GET: Pegar um produto específico do tenant
exports.getProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findOne({
      _id: productId,
      tenantId: req.tenant.tenantId // também comparamos com string
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('❌ Erro ao buscar produto:', error);
    res.status(500).json({ message: 'Server error while fetching product' });
  }
};
