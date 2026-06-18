require('dotenv').config();

const express = require('express');
const session = require('express-session');
const cors    = require('cors');
const path    = require('path');

const apiRoutes = require('./routes/api');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: `http://localhost:${PORT}`, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret:            process.env.SESSION_SECRET,
    resave:            false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: false, maxAge: 1000 * 60 * 60 * 8 }
}));

// Arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rotas da API
app.use('/api', apiRoutes);

// Rotas HTML
app.get('/',          (req, res) => res.sendFile(path.join(__dirname, '../frontend/views/index.html')));
app.get('/login',     (req, res) => res.sendFile(path.join(__dirname, '../frontend/views/login.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, '../frontend/views/dashboard.html')));
app.get('/painel',    (req, res) => res.sendFile(path.join(__dirname, '../frontend/views/painel-usuario.html')));

// ── HANDLER GLOBAL DE ERROS ────────────────────────────────────────────────
// OBRIGATÓRIO: sem isso, o Express 5 retorna HTML de erro nas falhas de DB
// e o fetch().json() do frontend lança SyntaxError, caindo no catch errado.
// Com este handler, QUALQUER erro não tratado sempre retorna JSON limpo.
app.use((err, req, res, next) => {
    console.error('Erro não tratado:', err.message);
    if (res.headersSent) return next(err);
    res.status(err.status || 500).json({
        erro: err.message || 'Erro interno no servidor.'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor: http://localhost:${PORT}`);
    console.log(`🌐 Site:     http://localhost:${PORT}/`);
    console.log(`📋 Admin:    http://localhost:${PORT}/dashboard`);
    console.log(`📋 Usuário:  http://localhost:${PORT}/painel`);
});
