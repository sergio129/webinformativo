const multer = require('multer');
const path = require('path');
const fs = require('fs');

const upload = multer({ dest: 'temp/' }); // Carpeta temporal para subir archivos
const IMAGES_DIR = path.join(__dirname, '..', 'imagenes');

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const uploadedFiles = req.files;

        if (!uploadedFiles || uploadedFiles.length === 0) {
            return res.status(400).send('No se subieron archivos.');
        }

        uploadedFiles.forEach(file => {
            const tempPath = file.path;
            const uniqueName = `${Date.now()}-${file.originalname}`;
            const targetPath = path.join(IMAGES_DIR, uniqueName);

            // Mueve el archivo a la carpeta "imagenes" con un nombre único
            fs.rename(tempPath, targetPath, err => {
                if (err) {
                    console.error('Error al mover el archivo:', err);
                    return res.status(500).send('Error al guardar las imágenes.');
                }
            });
        });

        res.status(200).send('Imágenes subidas y guardadas correctamente.');
    } else {
        res.status(405).send('Método no permitido');
    }
};
