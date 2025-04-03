const multer = require('multer');
const path = require('path');
const fs = require('fs');

const UPLOAD_DIR = path.join(__dirname, '..', 'imagenes', 'Casos_Exito');

// Configuración de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync(UPLOAD_DIR)) {
            fs.mkdirSync(UPLOAD_DIR, { recursive: true });
        }
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

module.exports = (req, res) => {
    if (req.method === 'POST') {
        upload.array('casosExito')(req, res, (err) => {
            if (err) {
                console.error('Error al subir las imágenes:', err);
                return res.status(500).send('Error al subir las imágenes.');
            }
            res.status(200).send('Imágenes subidas correctamente.');
        });
    } else {
        res.status(405).send('Método no permitido');
    }
};
