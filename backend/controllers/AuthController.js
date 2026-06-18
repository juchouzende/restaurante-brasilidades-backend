const Usuario = require('../models/Usuario');

class AuthController {

    static async login(req, res) {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Informe usuário e senha.'
            });
        }

        try {
            const usuario = await Usuario.autenticar(username, password);

            if (usuario) {
                req.session.usuario = {
                    username: usuario.username,
                    role: usuario.role
                };

                // Admin e usuário comum entram no mesmo painel.
                // As permissões são controladas pela API e pelo próprio dashboard.
                return res.status(200).json({
                    success: true,
                    user: req.session.usuario,
                    redirectTo: '/dashboard'
                });
            }

            return res.status(401).json({
                success: false,
                message: 'Usuário ou senha incorretos.'
            });

        } catch (erro) {
            console.error('Erro no login:', erro);
            return res.status(500).json({
                success: false,
                message: 'Erro interno no servidor.'
            });
        }
    }

    static logout(req, res) {
        req.session.destroy((erro) => {
            if (erro) {
                return res.status(500).json({
                    success: false,
                    message: 'Erro ao encerrar sessão.'
                });
            }

            res.clearCookie('connect.sid');
            return res.json({
                success: true,
                message: 'Logout realizado.'
            });
        });
    }

    static verificarSessao(req, res) {
        return res.json({
            success: true,
            user: req.session.usuario
        });
    }
}

module.exports = AuthController;
