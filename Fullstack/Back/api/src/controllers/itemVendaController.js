const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Criar item de venda
const create = async (req, res) => {
  try {
    const itemVenda = await prisma.itemVenda.create({ data: req.body });
    res.status(201).json(itemVenda);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao criar item de venda.', detalhes: err.message });
  }
};

// Listar todos os itens de venda
const findAll = async (req, res) => {
  try {
    const itensVenda = await prisma.itemVenda.findMany();
    res.json(itensVenda);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar itens de venda.', detalhes: err.message });
  }
};

// Buscar item de venda por ID
const findOne = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido.' });

  try {
    const itemVenda = await prisma.itemVenda.findUnique({ where: { id } });
    if (!itemVenda) return res.status(404).json({ erro: 'Item de venda não encontrado.' });

    res.json(itemVenda);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar item de venda.', detalhes: err.message });
  }
};

// Atualizar item de venda
const update = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido.' });

  try {
    const itemVenda = await prisma.itemVenda.update({
      where: { id },
      data: req.body
    });
    res.json(itemVenda);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao atualizar item de venda.', detalhes: err.message });
  }
};

// Deletar item de venda
const remove = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido.' });

  try {
    await prisma.itemVenda.delete({ where: { id } });
    res.json({ mensagem: 'Item de venda deletado com sucesso.' });
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao deletar item de venda.', detalhes: err.message });
  }
};

// Exportando funções
module.exports = {
  create,
  findAll,
  findOne,
  update,
  remove
};
