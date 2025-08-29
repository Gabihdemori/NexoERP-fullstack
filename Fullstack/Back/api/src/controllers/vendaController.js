const { PrismaClient, StatusVenda } = require('@prisma/client');
const prisma = new PrismaClient();

// Criar venda
// Criar venda
const create = async (req, res) => {
  try {
    const { clienteId, usuarioId, data, total, itens } = req.body;

    if (!clienteId || !data) {
      return res.status(400).json({ error: 'Dados da venda incompletos' });
    }

    let dataFormatada;

    // Se vier no formato pt-BR (dd/mm/yyyy hh:mm:ss)
    if (/\d{2}\/\d{2}\/\d{4}/.test(data)) {
      const [dia, mes, resto] = data.split('/');
      const [ano, hora] = resto.split(' ');
      dataFormatada = new Date(`${ano}-${mes}-${dia}T${hora || "00:00:00"}.000Z`);
    } else {
      // Caso já venha em ISO
      dataFormatada = new Date(data);
    }

    const venda = await prisma.venda.create({
  data: {
    clienteId,
    usuarioId,
    data: dataFormatada,
    status: StatusVenda.Pendente,
    total,
    itens: {
      create: itens.map(item => ({
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        precoUnit: item.precoUnit
      }))
    }
  },
  include: {
    itens: true
  }
});

    res.status(201).json(venda);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || 'Erro ao criar venda' });
  }
};


// Listar todas as vendas
const findAll = async (req, res) => {
  try {
    const vendas = await prisma.venda.findMany({
      include:{
        cliente:true,
        itens:true
      }
    });
    res.json(vendas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar vendas' });
  }
};

// Buscar venda por ID
const findOne = async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const venda = await prisma.venda.findUnique({
      where: { id },
      include: {
        cliente: true,
        itens: true
      }
    });

    if (!venda) return res.status(404).json({ error: 'Venda não encontrada' });
    res.json(venda);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar venda' });
  }
};


// Atualizar venda
// Atualizar venda
const update = async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const { data, ...rest } = req.body;
    let dataFormatada;

    if (data) {
      // Se vier no formato pt-BR (dd/mm/yyyy hh:mm:ss)
      if (/\d{2}\/\d{2}\/\d{4}/.test(data)) {
        const [dia, mes, resto] = data.split('/');
        const [ano, hora] = resto.split(' ');
        dataFormatada = new Date(`${ano}-${mes}-${dia}T${hora || "00:00:00"}.000Z`);
      } else {
        // Caso já venha em ISO
        dataFormatada = new Date(data);
      }
    }

    const venda = await prisma.venda.update({
      where: { id },
      data: {
        ...rest,
        ...(data ? { data: dataFormatada } : {})
      }
    });

    res.json(venda);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || 'Erro ao atualizar venda' });
  }
};


// Deletar venda (renomeado para remove)
const remove = async (req, res) => {
  try {
    await prisma.venda.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Venda deletada com sucesso' });
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
