const express = require('express');
const router = express.Router();

const validateUser = require('../middleware/validateUser.js');
const autenticarToken = require('../middleware/auth.js');

// Controllers (importe cada um conforme sua estrutura)
const usuarioController = require('./controllers/usuarioController.js');
const clienteController = require('./controllers/clienteController.js');
const produtoController = require('./controllers/produtoController.js');
const vendaController = require('./controllers/vendaController.js');
const itemVendaController = require('./controllers/itemVendaController.js');
const relatorioVendaController = require('./controllers/relatorioVendaController.js');

router.post('/usuarios', validateUser, usuarioController.create);
router.post('/login', validateUser, usuarioController.loginUser);

// Rotas de Usuário
router.post('/api/usuarios', usuarioController.create);
router.get('/api/usuarios', usuarioController.read);
router.get('/api/usuarios/:id', usuarioController.readOne);
router.put('/api/usuarios/:id', usuarioController.update);
router.delete('/api/usuarios/:id', usuarioController.remove);



// Rotas de Cliente
router.post('/api/clientes', clienteController.create);
router.get('/api/clientes', clienteController.findAll);
router.get('/api/clientes/:id', clienteController.findOne);
router.put('/api/clientes/:id', clienteController.update);
router.delete('/api/clientes/:id', clienteController.remove);

// Rotas de Produto
router.post('/api/produtos', produtoController.create);
router.get('/api/produtos', produtoController.findAll);
router.get('/api/produtos/:id', produtoController.findOne);
router.put('/api/produtos/:id', produtoController.update);
router.delete('/api/produtos/:id', produtoController.remove);

// Rotas de Venda
router.post('/api/vendas', vendaController.create);
router.get('/api/vendas', vendaController.findAll);
router.get('/api/vendas/:id', vendaController.findOne);
router.put('/api/vendas/:id', vendaController.update);
router.delete('/api/vendas/:id', vendaController.remove);

// Rotas de ItemVenda
router.post('/api/itensvenda', itemVendaController.create);
router.get('/api/itensvenda', itemVendaController.findAll);
router.get('/api/itensvenda/:id', itemVendaController.findOne);
router.put('/api/itensvenda/:id', itemVendaController.update);
router.delete('/api/itensvenda/:id', itemVendaController.remove);

// Rotas de RelatorioVenda
router.post('/api/relatoriosvenda', relatorioVendaController.create);
router.get('/api/relatoriosvenda', relatorioVendaController.findAll);
router.get('/api/relatoriosvenda/:id', relatorioVendaController.findOne);
router.put('/api/relatoriosvenda/:id', relatorioVendaController.update);
router.delete('/api/relatoriosvenda/:id', relatorioVendaController.delete);

module.exports = router;