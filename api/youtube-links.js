const fs = require('fs');
const path = require('path');

const YOUTUBE_LINKS_FILE = path.join(__dirname, '..', 'youtube-links.json');

// Asegura que el archivo de enlaces de YouTube exista
if (!fs.existsSync(YOUTUBE_LINKS_FILE)) {
    fs.writeFileSync(YOUTUBE_LINKS_FILE, JSON.stringify([]), 'utf8');
}

module.exports = async (req, res) => {
    if (req.method === 'GET') {
        fs.readFile(YOUTUBE_LINKS_FILE, 'utf8', (err, data) => {
            if (err) {
                console.error('Error leyendo los enlaces de YouTube:', err);
                return res.status(500).send('Error al obtener los enlaces de YouTube.');
            }
            res.json(JSON.parse(data));
        });
    } else if (req.method === 'POST') {
        const { videoId } = req.body;
        if (!videoId) {
            return res.status(400).send('ID de video no proporcionado.');
        }

        fs.readFile(YOUTUBE_LINKS_FILE, 'utf8', (err, data) => {
            const links = err && err.code === 'ENOENT' ? [] : JSON.parse(data);
            links.push(videoId);

            fs.writeFile(YOUTUBE_LINKS_FILE, JSON.stringify(links, null, 2), err => {
                if (err) {
                    console.error('Error guardando el enlace de YouTube:', err);
                    return res.status(500).send('Error al guardar el enlace de YouTube.');
                }
                res.status(200).send('Enlace de YouTube guardado correctamente.');
            });
        });
    } else {
        res.status(405).send('Método no permitido');
    }
};
