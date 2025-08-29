const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Função para formatar datas no padrão brasileiro (pt-BR)
 */
function formatarDatas(cliente) {
  return {
    ...cliente,
    criadoEm: new Date(cliente.criadoEm).toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      dateStyle: 'short',
      timeStyle: 'short'
    }),
    atualizadoEm: new Date(cliente.atualizadoEm).toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      dateStyle: 'short',
      timeStyle: 'short'
    })
  };
}

// Criar Cliente
const create = async (req, res) => {
  try {
    const cliente = await prisma.cliente.create({ data: req.body });
    res.status(201).json(formatarDatas(cliente));
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao cadastrar cliente.', detalhes: err.message });
  }
};

// Listar Todos os Clientes
const findAll = async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany();
    const clientesFormatados = clientes.map(formatarDatas);
    res.json(clientesFormatados);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar clientes.', detalhes: err.message });
  }
};

// Buscar Cliente por ID
const findOne = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido.' });

  try {
    const cliente = await prisma.cliente.findUnique({ where: { id } });
    if (!cliente) return res.status(404).json({ erro: 'Cliente não encontrado.' });

    res.json(formatarDatas(cliente));
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar cliente.', detalhes: err.message });
  }
};

// Buscar Cliente por CPF ou CNPJ
const findByDocumento = async (req, res) => {
  const { documento } = req.query;

  if (!documento) {
    return res.status(400).json({ erro: 'Informe um CPF ou CNPJ válido na query string.' });
  }

  try {
    const cliente = await prisma.cliente.findFirst({
      where: {
        OR: [
          { cpf: documento },
          { cnpj: documento }
        ]
      }
    });

    if (!cliente) {
      return res.status(404).json({ erro: 'Cliente não encontrado com o CPF ou CNPJ informado.' });
    }

    res.json(formatarDatas(cliente));
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar cliente por CPF ou CNPJ.', detalhes: err.message });
  }
};

// Atualizar Cliente
const update = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido.' });

  try {
    const cliente = await prisma.cliente.update({
      where: { id },
      data: req.body
    });
    res.json(formatarDatas(cliente));
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao atualizar cliente.', detalhes: err.message });
  }
};

// Deletar Cliente
const remove = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido.' });

  try {
    await prisma.cliente.delete({ where: { id } });
    res.json({ mensagem: 'Cliente deletado com sucesso.' });
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao deletar cliente.', detalhes: err.message });
  }
};

// Exportando todas as funções
module.exports = {
  create,
  findAll,
  findOne,
  findByDocumento,
  update,
  remove
};
