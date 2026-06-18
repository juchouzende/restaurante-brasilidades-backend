const Prato = require('../models/Prato');

// ============================================================
// CLASSE PratoController
// Gerencia todas as requisições relacionadas a pratos:
// listagem pública, CRUD completo para admins,
// e alternância de disponibilidade.
// ============================================================
class PratoController {

    // --------------------------------------------------------
    // listarPublico()
    // Rota pública — retorna apenas pratos DISPONÍVEIS.
    // Usada pelo cardápio no index.html.
    // --------------------------------------------------------
    static async listarPublico(req, res) {
        try {
            const pratos = await Prato.listarDisponiveis();
            return res.json(pratos);
        } catch (erro) {
            console.error('Erro ao listar pratos públicos:', erro);
            return res.status(500).json({ erro: 'Erro ao carregar cardápio.' });
        }
    }

    // --------------------------------------------------------
    // listar()
    // Rota privada (admin) — retorna TODOS os pratos.
    // --------------------------------------------------------
    static async listar(req, res) {
        try {
            const pratos = await Prato.listarTodos();
            return res.json(pratos);
        } catch (erro) {
            console.error('Erro ao listar pratos:', erro);
            return res.status(500).json({ erro: 'Erro ao listar pratos.' });
        }
    }

    // --------------------------------------------------------
    // buscarUm()
    // Busca um prato pelo ID para preencher o modal de edição.
    // --------------------------------------------------------
    static async buscarUm(req, res) {
        try {
            const prato = await Prato.buscarPorId(req.params.id);
            if (!prato) return res.status(404).json({ erro: 'Prato não encontrado.' });
            console.log('Prato buscado:', prato.exibirResumo());
            return res.json(prato);
        } catch (erro) {
            console.error('Erro ao buscar prato:', erro);
            return res.status(500).json({ erro: 'Erro ao buscar prato.' });
        }
    }

    // --------------------------------------------------------
    // adicionar()
    // Cadastra novo prato. Aceita upload de foto OU URL externa.
    // Se um arquivo for enviado, usa o arquivo; senão, usa a URL do campo imagemUrl.
    // --------------------------------------------------------
    static async adicionar(req, res) {
        const { nome, categoria, descricao, preco, status, imagemUrl } = req.body;

        if (req.fileValidationError) {
            return res.status(400).json({ erro: req.fileValidationError });
        }

        // Prioridade: arquivo enviado > URL informada > default
        let imagem = req.file ? req.file.filename : (imagemUrl || null);

        if (!nome || !categoria || !descricao || !preco || !status) {
            return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios.' });
        }

        if (Number(preco) < 0) {
            return res.status(400).json({ erro: 'O preço não pode ser negativo.' });
        }

        try {
            const novoId = await Prato.adicionar(nome, categoria, descricao, preco, status, imagem);
            return res.status(201).json({ mensagem: 'Prato cadastrado com sucesso!', id: novoId });
        } catch (erro) {
            console.error('Erro ao adicionar prato:', erro);
            return res.status(500).json({ erro: 'Erro ao cadastrar prato.' });
        }
    }

    // --------------------------------------------------------
    // editar()
    // Atualiza prato existente. Nova imagem é opcional.
    // --------------------------------------------------------
    static async editar(req, res) {
        const id = req.params.id;
        const { nome, categoria, descricao, preco, status, imagemUrl } = req.body;

        if (req.fileValidationError) {
            return res.status(400).json({ erro: req.fileValidationError });
        }

        let imagem = req.file ? req.file.filename : (imagemUrl || null);

        if (!nome || !categoria || !descricao || !preco || !status) {
            return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios.' });
        }

        if (Number(preco) < 0) {
            return res.status(400).json({ erro: 'O preço não pode ser negativo.' });
        }

        try {
            await Prato.editar(id, nome, categoria, descricao, preco, status, imagem);
            return res.json({ mensagem: 'Prato atualizado com sucesso!' });
        } catch (erro) {
            console.error('Erro ao editar prato:', erro);
            return res.status(500).json({ erro: 'Erro ao atualizar prato.' });
        }
    }

    // --------------------------------------------------------
    // alterarStatus()
    // Alterna disponibilidade do prato (Disponível ↔ Indisponível).
    // --------------------------------------------------------
    static async alterarStatus(req, res) {
        try {
            const prato = await Prato.buscarPorId(req.params.id);
            if (!prato) return res.status(404).json({ erro: 'Prato não encontrado.' });

            const novoStatus = prato.estaDisponivel() ? 'Indisponível' : 'Disponível';
            await Prato.alterarStatus(req.params.id, novoStatus);

            return res.json({ mensagem: `Prato marcado como ${novoStatus}!`, status: novoStatus });
        } catch (erro) {
            console.error('Erro ao alterar status:', erro);
            return res.status(500).json({ erro: 'Erro ao alterar status.' });
        }
    }

    // --------------------------------------------------------
    // deletar()
    // Remove permanentemente um prato.
    // --------------------------------------------------------
    static async deletar(req, res) {
        try {
            await Prato.deletar(req.params.id);
            return res.json({ mensagem: 'Prato removido com sucesso.' });
        } catch (erro) {
            console.error('Erro ao deletar prato:', erro);
            return res.status(500).json({ erro: 'Erro ao remover prato.' });
        }
    }
}

module.exports = PratoController;
