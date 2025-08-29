const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// Função para formatar datas de produto
function formatarDatas(produto) {
  return {
    ...produto,
    criadoEm: produto.criadoEm
  ? new Date(produto.criadoEm).toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      dateStyle: 'short',
      timeStyle: 'short',
    })
  : null,
    atualizadoEm: produto.atualizadoEm
      ? new Date(produto.atualizadoEm).toLocaleString('pt-BR', {
          timeZone: 'America/Sao_Paulo',
          dateStyle: 'short',
          timeStyle: 'short',
        })
      : null
  };
}

// Criar produto
const create = async (req, res) => {
  try {
    const produto = await prisma.produto.create({ data: req.body });
    res.status(201).json(formatarDatas(produto));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Listar todos os produtos
const findAll = async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany();
    res.json(produtos.map(formatarDatas));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Buscar produto por ID
const findOne = async (req, res) => {
  try {
    const produto = await prisma.produto.findUnique({ where: { id: Number(req.params.id) } });
    if (!produto) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(formatarDatas(produto));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Atualizar produto
const update = async (req, res) => {
  try {
    const produto = await prisma.produto.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(formatarDatas(produto));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Deletar produto (renomeado para 'remove')
const remove = async (req, res) => {
  try {
    await prisma.produto.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Produto deletado com sucesso' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  create,
  findAll,
  findOne,
  update,
  remove
};
