const express = require('express');
const router  = express.Router();

const AuthController  = require('../controllers/AuthController');
const PratoController = require('../controllers/PratoController');

const { autenticado, apenasAdmin } = require('../middleware/auth');
const { uploadComTratamento }      = require('../config/upload');

// ── AUTENTICAÇÃO ──────────────────────────────────────────────
router.post('/login',   AuthController.login);
router.post('/logout',  autenticado, AuthController.logout);
router.get('/sessao',   autenticado, AuthController.verificarSessao);

// ── ROTAS PÚBLICAS (sem login) ────────────────────────────────
// Cardápio visível no site — apenas pratos Disponíveis
router.get('/public/pratos', PratoController.listarPublico);

// ── ROTAS PARA QUALQUER USUÁRIO LOGADO ────────────────────────
// O usuário comum também acessa o dashboard, mas apenas para visualizar.
router.get('/pratos',      autenticado, PratoController.listar);
router.get('/pratos/:id',  autenticado, PratoController.buscarUm);
router.get('/meu-cardapio', autenticado, PratoController.listar);

// ── ROTAS PRIVADAS DE ALTERAÇÃO (somente admin) ───────────────
router.post('/pratos',           autenticado, apenasAdmin, uploadComTratamento('imagem'), PratoController.adicionar);
router.put('/pratos/:id',        autenticado, apenasAdmin, uploadComTratamento('imagem'), PratoController.editar);
router.put('/pratos/:id/status', autenticado, apenasAdmin, PratoController.alterarStatus);
router.delete('/pratos/:id',     autenticado, apenasAdmin, PratoController.deletar);

module.exports = router;
