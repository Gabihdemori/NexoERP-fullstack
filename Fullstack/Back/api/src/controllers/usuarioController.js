const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Função para formatar datas no padrão brasileiro com nomes amigáveis
 */
function formatarDatas(usuario) {
  return {
    ...usuario,
    criadoEm: new Date(usuario.criadoEm).toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      dateStyle: 'short',
      timeStyle: 'short'
    }),
    atualizadoEm: new Date(usuario.atualizadoEm).toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      dateStyle: 'short',
      timeStyle: 'short'
    })
  };
}

// Criar usuário
async function create(req, res) {
    const { nome, email, senha, perfil } = req.body;

    // Aceita apenas os perfis válidos
    const perfisValidos = ['Admin', 'Gerente', 'Operador'];
    let perfilBanco = 'Operador';
    if (perfil && perfisValidos.includes(perfil)) {
      perfilBanco = perfil;
    }

    try {
        const hashedSenha = await bcrypt.hash(senha, 10);

        const newUser = await prisma.usuario.create({
            data: {
                nome,
                email,
                senha: hashedSenha,
                perfil: perfilBanco,
            },
        });

        res.status(201).json(formatarDatas(newUser));
    } catch (error) {
        if (error.code === 'P2002') {
            res.status(400).json({ error: 'Email já está em uso' });
        } else {
            res.status(500).json({ error: 'Erro interno no servidor' });
        }
    }
}

// Listar todos os usuários
const read = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany();
    const formatados = usuarios.map(formatarDatas);
    res.json(formatados);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar usuários.', detalhes: err.message });
  }
};

// Buscar usuário por ID
const readOne = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido.' });

  try {
    const usuario = await prisma.usuario.findUnique({ where: { id } });
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado.' });

    res.json(formatarDatas(usuario));
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar usuário.', detalhes: err.message });
  }
};

// Atualizar usuário
const update = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido.' });

  // Aceita apenas os perfis válidos
  const perfisValidos = ['Admin', 'Gerente', 'Operador'];
  let dataUpdate = { ...req.body };
  if (dataUpdate.perfil && !perfisValidos.includes(dataUpdate.perfil)) {
    delete dataUpdate.perfil;
  }

  try {
    const usuario = await prisma.usuario.update({
      where: { id },

      data: dataUpdate
    });
    res.json(formatarDatas(usuario));
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao atualizar usuário.', detalhes: err.message });
  }
};

// Deletar usuário
const remove = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido.' });

  try {
    await prisma.usuario.delete({ where: { id } });
    res.json({ mensagem: 'Usuário deletado com sucesso.' });
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao deletar usuário.', detalhes: err.message });
  }
};

const loginUser = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const user = await prisma.usuario.findUnique({ where: { email } });

        if (!user) return res.status(401).json({ error: 'Email ou senha incorretos.' });

        const validPassword = await bcrypt.compare(senha, user.senha);
        if (!validPassword) return res.status(401).json({ error: 'Email ou senha incorretos.' });

        const token = jwt.sign(
            { id: user.id, email: user.email, perfil: user.perfil },
                'seuSegredoJWT',
                { expiresIn: '1d' }
            );
        res.json({ message: 'Login bem-sucedido', token });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao fazer login.' });
    }
};

// Exportando todas as funções
module.exports = {
  create,
  read,
  readOne,
  update,
  remove,
  loginUser
};
