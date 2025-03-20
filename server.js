const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware para extrair tenantId do subdomínio
app.use((req, res, next) => {
  const tenantId = req.hostname.split('.')[0] || 'pizzaria-a'; // Default para teste
  req.tenantId = tenantId;
  next();
});

app.use(cors());
app.use(express.json());

// Configuração do Mongoose para evitar aviso de strictQuery
mongoose.set('strictQuery', false);


// Conexão com o MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log('Conectado ao MongoDB');
    console.log('Database Name:', mongoose.connection.db.databaseName);
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Coleções no banco:', collections.map(col => col.name));
  })
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Rotas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
