const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Formata datas no padrão brasileiro (caso existam no modelo)
 */
function formatarDatas(relatorio) {
  return {
    ...relatorio,
    criadoEm: relatorio.criadoEm
      ? new Date(relatorio.criadoEm).toLocaleString('pt-BR', {
          timeZone: 'America/Sao_Paulo',
          dateStyle: 'short',
          timeStyle: 'short',
        })
      : null,
    atualizadoEm: relatorio.atualizadoEm
      ? new Date(relatorio.atualizadoEm).toLocaleString('pt-BR', {
          timeZone: 'America/Sao_Paulo',
          dateStyle: 'short',
          timeStyle: 'short',
        })
      : null
  };
}

// Criar relatório de venda
const create = async (req, res) => {
  try {
    const relatorio = await prisma.relatorioVenda.create({
      data: req.body,
    });
    res.status(201).json(formatarDatas(relatorio));
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao criar relatório.', detalhes: err.message });
  }
};

// Listar todos os relatórios de venda
const findAll = async (req, res) => {
  try {
    const relatorios = await prisma.relatorioVenda.findMany();
    res.json(relatorios.map(formatarDatas));
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar relatórios.', detalhes: err.message });
  }
};

// Buscar relatório por ID
const findOne = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido.' });

  try {
    const relatorio = await prisma.relatorioVenda.findUnique({ where: { id } });
    if (!relatorio) return res.status(404).json({ erro: 'Relatório de venda não encontrado.' });

    res.json(formatarDatas(relatorio));
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar relatório.', detalhes: err.message });
  }
};

// Atualizar relatório
const update = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido.' });

  try {
    const relatorio = await prisma.relatorioVenda.update({
      where: { id },
      data: req.body,
    });
    res.json(formatarDatas(relatorio));
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao atualizar relatório.', detalhes: err.message });
  }
};

// Deletar relatório
const remove = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido.' });

  try {
    await prisma.relatorioVenda.delete({ where: { id } });
    res.json({ mensagem: 'Relatório de venda deletado com sucesso.' });
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao deletar relatório.', detalhes: err.message });
  }
};

// Exportação padronizada
module.exports = {
  create,
  findAll,
  findOne,
  update,
  delete: remove
};
