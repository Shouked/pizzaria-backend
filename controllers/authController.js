exports.login = async (req, res) => {
  const { email, password } = req.body;
  const { tenantId } = req.params;

  console.log('Iniciando login para:', { email, tenantId });

  try {
    console.log('Buscando usuário no banco...');
    const user = await User.findOne({ email, tenantId });
    console.log('Usuário encontrado:', user || 'Nenhum usuário encontrado');

    if (!user) {
      console.log('Usuário não encontrado');
      return res.status(400).json({ msg: 'Credenciais inválidas' });
    }

    console.log('Comparando senha...');
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Senha válida:', isMatch);

    if (!isMatch) {
      console.log('Senha inválida');
      return res.status(400).json({ msg: 'Credenciais inválidas' });
    }

    const payload = {
      userId: user.id,
      tenantId: user.tenantId,
      email: user.email,
      isAdmin: user.isAdmin
    };

    console.log('Gerando token...');
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Token gerado com sucesso');

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        tenantId: user.tenantId,
        isAdmin: user.isAdmin
      }
    });
  } catch (err) {
    console.error('Erro no login:', err.message);
    res.status(500).send('Erro no servidor');
  }
};
