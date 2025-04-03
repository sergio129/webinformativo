const multer = require('multer');
const path = require('path');
const fs = require('fs');

const UPLOAD_DIR = path.join(__dirname, '..', 'videos', 'testimonios');

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
        upload.array('testimonialVideos')(req, res, (err) => {
            if (err) {
                console.error('Error al subir los videos de testimonios:', err);
                return res.status(500).send('Error al subir los videos de testimonios.');
            }
            res.status(200).send('Videos de testimonios subidos correctamente.');
        });
    } else {
        res.status(405).send('Método no permitido');
    }
};
