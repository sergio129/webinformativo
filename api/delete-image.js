const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '..', 'imagenes');

module.exports = async (req, res) => {
    if (req.method === 'DELETE') {
        const { key } = req.query;

        if (!key) {
            return res.status(400).send('No se proporcionó la clave del archivo.');
        }

        const filePath = path.join(IMAGES_DIR, key);

        fs.unlink(filePath, err => {
            if (err) {
                console.error('Error al eliminar la imagen:', err);
                return res.status(500).send('Error al eliminar la imagen.');
            }
            res.status(200).send('Imagen eliminada correctamente.');
        });
    } else {
        res.status(405).send('Método no permitido');
    }
};
