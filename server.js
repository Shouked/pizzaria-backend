const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

console.log('✅ server.js carregado em: ' + new Date().toISOString());

app.use(cors({
  origin: 'https://pizzadabia.netlify.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Log para todas as requisições
app.use((req, res, next) => {
  console.log('Requisição recebida:', req.method, req.url, 'em:', new Date().toISOString());
  console.log('Headers:', req.headers);
  next();
});

// Rotas
const authRoutes = require('./routes/auth');
console.log('Rotas registradas em /api/auth:', authRoutes.stack.map(r => ({
  path: r.route?.path,
  methods: r.route?.methods,
  middlewares: r.route?.stack.map(m => m.handle.name || 'anonymous')
})));
app.use('/api/auth', authRoutes);

const tenantsRoutes = require('./routes/tenants');
console.log('Rotas registradas em /api/tenants:', tenantsRoutes.stack.map(r => ({
  path: r.route?.path,
  methods: r.route?.methods,
  middlewares: r.route?.stack.map(m => m.handle.name || 'anonymous')
})));
app.use('/api/tenants', tenantsRoutes);

app.use('/api/orders', require('./routes/orders'));
app.use('/api/products', require('./routes/products'));

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
