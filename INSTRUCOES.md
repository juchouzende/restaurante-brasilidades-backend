# 🍽️ Restaurante Brasilidades — Sistema Completo

## 📁 Estrutura do Projeto

```
restaurante_completo/
├── banco_de_dados.sql          ← Execute no MySQL primeiro
├── backend/
│   ├── config/
│   │   ├── db.js               ← Pool de conexão MySQL
│   │   └── upload.js           ← Multer (upload de fotos)
│   ├── controllers/
│   │   ├── AuthController.js   ← Login / Logout / Sessão
│   │   └── PratoController.js  ← CRUD completo de pratos
│   ├── middleware/
│   │   └── auth.js             ← Proteção de rotas
│   ├── models/
│   │   ├── Prato.js            ← Model do Prato
│   │   └── Usuario.js          ← Model do Usuário (bcrypt)
│   ├── routes/
│   │   └── api.js              ← Todas as rotas da API
│   ├── .env                    ← ⚠️ Configure sua senha MySQL aqui
│   ├── package.json
│   ├── seed.js                 ← Cria usuários iniciais
│   └── server.js               ← Servidor principal Express
├── frontend/
│   ├── css/
│   │   └── style.css           ← CSS original inalterado
│   └── views/
│       ├── index.html          ← Site público (cardápio dinâmico)
│       ├── login.html          ← Login via API
│       └── dashboard.html      ← Painel admin com CRUD
└── uploads/                    ← Fotos enviadas (criada automaticamente)
```

---

## 🚀 Passo a Passo

### 1️⃣ Criar o Banco de Dados

Abra o **MySQL Workbench** e execute o arquivo `banco_de_dados.sql`.

Isso cria o banco `restaurante_db` com as tabelas `usuarios` e `pratos`,
já populado com os 6 pratos originais do cardápio.

---

### 2️⃣ Configurar o `.env`

Edite `backend/.env` e coloque sua senha do MySQL:

```env
DB_PASSWORD=SUA_SENHA_AQUI
```

---

### 3️⃣ Instalar Dependências

No terminal, dentro da pasta `backend/`:

```bash
npm install
```

---

### 4️⃣ Criar Usuários

```bash
node seed.js
```

---

### 5️⃣ Iniciar o Servidor

```bash
node server.js
```

Ou com reinício automático ao salvar:

```bash
npm run dev
```

Acesse: **http://localhost:3000**

---

## 🔐 Credenciais

| Usuário | Senha     | Perfil |
|---------|-----------|--------|
| admin   | admin123  | Admin  |

---

## 🌐 Páginas

| URL                              | Descrição                          |
|----------------------------------|------------------------------------|
| http://localhost:3000/           | Site público com cardápio dinâmico |
| http://localhost:3000/login      | Login administrativo               |
| http://localhost:3000/dashboard  | Painel admin (requer login)        |

---

## 🔌 Rotas da API

| Método | Rota                        | Acesso  | Descrição                        |
|--------|-----------------------------|---------|----------------------------------|
| POST   | `/api/login`                | Público | Fazer login                      |
| POST   | `/api/logout`               | Logado  | Fazer logout                     |
| GET    | `/api/sessao`               | Logado  | Verificar sessão                 |
| GET    | `/api/public/pratos`        | Público | Listar pratos disponíveis        |
| GET    | `/api/pratos`               | Admin   | Listar todos os pratos           |
| GET    | `/api/pratos/:id`           | Admin   | Buscar prato por ID              |
| POST   | `/api/pratos`               | Admin   | Cadastrar novo prato             |
| PUT    | `/api/pratos/:id`           | Admin   | Editar prato existente           |
| PUT    | `/api/pratos/:id/status`    | Admin   | Alternar disponibilidade         |
| DELETE | `/api/pratos/:id`           | Admin   | Remover prato                    |

---

## ✅ Funcionalidades do Dashboard

- **Cadastrar** novo prato com foto (upload ou URL externa)
- **Editar** qualquer prato (nome, categoria, descrição, preço, status, foto)
- **Alternar disponibilidade** — o botão 👁️ esconde/mostra o prato no site
- **Excluir** prato com modal de confirmação
- **Cards de resumo** com totais em tempo real
