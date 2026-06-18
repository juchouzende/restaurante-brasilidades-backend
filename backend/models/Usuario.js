const db     = require('../config/db');
const bcrypt = require('bcrypt');

class Usuario {
    constructor(id, username, role) {
        this.id = id; this.username = username; this.role = role;
    }

    exibirInfo() { return `Usuário: ${this.username} | Perfil: ${this.role}`; }

    static async autenticar(username, senhaDigitada) {
        const [rows] = await db.execute('SELECT * FROM usuarios WHERE username = ?', [username]);
        if (rows.length === 0) return null;
        const u = rows[0];
        const ok = await bcrypt.compare(senhaDigitada, u.password);
        return ok ? new Usuario(u.id, u.username, u.role) : null;
    }
}

module.exports = Usuario;
