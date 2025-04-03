const fs = require('fs');
const path = require('path');

const VIDEOS_DIR = path.join(__dirname, '..', 'videos', 'testimonios');

// Asegura que la carpeta de videos exista
if (!fs.existsSync(VIDEOS_DIR)) {
    fs.mkdirSync(VIDEOS_DIR, { recursive: true });
}

module.exports = (req, res) => {
    if (req.method === 'GET') {
        fs.readdir(VIDEOS_DIR, (err, files) => {
            if (err) {
                console.error('Error al leer la carpeta de videos:', err);
                return res.status(500).send('Error al obtener los videos.');
            }

            // Filtra solo archivos de video
            const videoFiles = files.filter(file => /\.(mp4|avi|mov|mkv)$/i.test(file));
            res.json(videoFiles);
        });
    } else if (req.method === 'DELETE') {
        const { videoName } = req.query;

        if (!videoName) {
            return res.status(400).send('No se proporcionó el nombre del video.');
        }

        const filePath = path.join(VIDEOS_DIR, videoName);

        fs.unlink(filePath, err => {
            if (err) {
                console.error('Error al eliminar el video:', err);
                return res.status(500).send('Error al eliminar el video.');
            }
            res.status(200).send('Video eliminado correctamente.');
        });
    } else {
        res.status(405).send('Método no permitido');
    }
};
