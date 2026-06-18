// Importa o pool de conexões com o banco de dados
const db = require('../config/db');

// ============================================================
// CLASSE Prato
// Representa um prato do cardápio do restaurante.
// ============================================================
class Prato {

    constructor(id, nome, categoria, descricao, preco, status, imagem, criado_em) {
        this.id        = id;
        this.nome      = nome;
        this.categoria = categoria;
        this.descricao = descricao;
        this.preco     = preco;       // Decimal (ex: 85.00)
        this.status    = status;     // 'Disponível' ou 'Indisponível'
        this.imagem    = imagem;     // URL externa ou nome de arquivo de upload
        this.criado_em = criado_em;
    }

    // ============================================================
    // MÉTODO DE INSTÂNCIA: estaDisponivel()
    // ============================================================
    estaDisponivel() {
        return this.status === 'Disponível';
    }

    // ============================================================
    // MÉTODO DE INSTÂNCIA: exibirResumo()
    // ============================================================
    exibirResumo() {
        return `[${this.categoria}] ${this.nome} — R$ ${this.preco} — ${this.status}`;
    }

    // ============================================================
    // MÉTODO ESTÁTICO: precoFormatado()
    // Retorna o preço no formato brasileiro (R$ 85,00)
    // ============================================================
    precoFormatado() {
        return `R$ ${parseFloat(this.preco).toFixed(2).replace('.', ',')}`;
    }

    // ============================================================
    // MÉTODO ESTÁTICO: listarTodos()
    // ============================================================
    static async listarTodos() {
        const [rows] = await db.execute('SELECT * FROM pratos ORDER BY id DESC');
        return rows;
    }

    // ============================================================
    // MÉTODO ESTÁTICO: listarDisponiveis()
    // Apenas pratos disponíveis — usado pela vitrine pública
    // ============================================================
    static async listarDisponiveis() {
        const [rows] = await db.execute(
            "SELECT * FROM pratos WHERE status = 'Disponível' ORDER BY categoria, nome"
        );
        return rows;
    }

    // ============================================================
    // MÉTODO ESTÁTICO: buscarPorId()
    // ============================================================
    static async buscarPorId(id) {
        const [rows] = await db.execute('SELECT * FROM pratos WHERE id = ?', [id]);
        if (rows.length === 0) return null;
        const d = rows[0];
        return new Prato(d.id, d.nome, d.categoria, d.descricao, d.preco, d.status, d.imagem, d.criado_em);
    }

    // ============================================================
    // MÉTODO ESTÁTICO: adicionar()
    // imagem pode ser URL externa ou nome de arquivo uploadado
    // ============================================================
    static async adicionar(nome, categoria, descricao, preco, status, imagem) {
        const imagemFinal = imagem || 'default.jpg';
        const [resultado] = await db.execute(
            'INSERT INTO pratos (nome, categoria, descricao, preco, status, imagem) VALUES (?, ?, ?, ?, ?, ?)',
            [nome, categoria, descricao, preco, status, imagemFinal]
        );
        return resultado.insertId;
    }

    // ============================================================
    // MÉTODO ESTÁTICO: editar()
    // Se nova imagem enviada, atualiza; senão mantém a atual
    // ============================================================
    static async editar(id, nome, categoria, descricao, preco, status, imagem) {
        if (imagem) {
            await db.execute(
                'UPDATE pratos SET nome=?, categoria=?, descricao=?, preco=?, status=?, imagem=? WHERE id=?',
                [nome, categoria, descricao, preco, status, imagem, id]
            );
        } else {
            await db.execute(
                'UPDATE pratos SET nome=?, categoria=?, descricao=?, preco=?, status=? WHERE id=?',
                [nome, categoria, descricao, preco, status, id]
            );
        }
    }

    // ============================================================
    // MÉTODO ESTÁTICO: alterarStatus()
    // Alterna entre 'Disponível' e 'Indisponível'
    // ============================================================
    static async alterarStatus(id, novoStatus) {
        await db.execute('UPDATE pratos SET status=? WHERE id=?', [novoStatus, id]);
    }

    // ============================================================
    // MÉTODO ESTÁTICO: deletar()
    // ============================================================
    static async deletar(id) {
        await db.execute('DELETE FROM pratos WHERE id=?', [id]);
    }
}

module.exports = Prato;
