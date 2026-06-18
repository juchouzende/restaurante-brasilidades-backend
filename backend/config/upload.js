const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const ext    = path.extname(file.originalname);
        const unique = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
        cb(null, unique);
    }
});

const fileFilter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        // Rejeita o arquivo mas NÃO lança erro — requisição continua normalmente
        // O campo req.fileValidationError fica disponível no controller
        req.fileValidationError = 'Formato inválido. Envie apenas JPG, PNG ou WEBP.';
        cb(null, false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
});

// ── WRAPPER que captura erros do Multer (tamanho excedido, etc.)
// e os transforma numa resposta JSON limpa, sem travar a requisição.
// Necessário porque o Express 5 não faz o repasse automático de erros
// de middleware para o handler da rota.
function uploadComTratamento(campo) {
    return function (req, res, next) {
        upload.single(campo)(req, res, function (err) {
            if (err) {
                // Erro do próprio Multer (ex: arquivo maior que 5 MB)
                const msg = err.code === 'LIMIT_FILE_SIZE'
                    ? 'Arquivo muito grande. Máximo permitido: 5 MB.'
                    : err.message || 'Erro no upload do arquivo.';
                return res.status(400).json({ erro: msg });
            }
            // Sem erro — segue para o controller normalmente
            next();
        });
    };
}

module.exports = { uploadComTratamento };
