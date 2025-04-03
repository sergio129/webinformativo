const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '..', 'imagenes', 'Casos_Exito');

module.exports = (req, res) => {
    if (req.method === 'GET') {
        fs.readdir(IMAGES_DIR, (err, files) => {
            if (err) {
                console.error('Error al leer la carpeta de imágenes:', err);
                return res.status(500).send('Error al obtener las imágenes.');
            }

            // Filtra solo archivos de imagen
            const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
            res.json(imageFiles);
        });
    } else {
        res.status(405).send('Método no permitido');
    }
};
