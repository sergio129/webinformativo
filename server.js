require('dotenv').config(); // Carga las variables de entorno desde .env
const AWS = require('aws-sdk');
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Configurar multer para manejar archivos grandes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const tempDir = path.join(__dirname, 'temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir); // Crea la carpeta temporal si no existe
        }
        cb(null, tempDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 500 * 1024 * 1024 } // Límite de tamaño de archivo: 500 MB
});

const youtubeLinksFile = path.join(__dirname, 'youtube-links.json');

// Configura AWS con las credenciales del archivo .env
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

// Middleware para manejar JSON y formularios con límites aumentados
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname)));
app.use('/imagenes', express.static(path.join(__dirname, 'imagenes')));

// Ruta para manejar el inicio de sesión
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Credenciales almacenadas en el código
    const validUsername = 'sergio.anaya';
    const validPassword = 'Sheyo_0129';

    if (username === validUsername && password === validPassword) {
        res.status(200).send('Inicio de sesión exitoso');
    } else {
        res.status(401).send('Usuario o contraseña incorrectos');
    }
});

// Middleware para proteger la página de administración
app.use('/admin.html', (req, res, next) => {
    const referer = req.get('Referer');
    if (referer && referer.includes('/login.html')) {
        next(); // Permite el acceso si proviene del login
    } else {
        res.redirect('/login.html'); // Redirige al login si no hay referencia válida
    }
});

// Ruta para subir imágenes
app.post('/upload', upload.array('images'), (req, res) => {
    const uploadedFiles = req.files;

    if (!uploadedFiles || uploadedFiles.length === 0) {
        return res.status(400).send('No se subieron archivos.');
    }

    uploadedFiles.forEach(file => {
        const tempPath = file.path;
        const targetPath = path.join(__dirname, 'imagenes', file.filename);

        // Mueve el archivo a la carpeta "imagenes"
        fs.rename(tempPath, targetPath, err => {
            if (err) {
                console.error('Error al mover el archivo:', err);
                return res.status(500).send('Error al guardar las imágenes.');
            }
        });
    });

    res.status(200).send('Imágenes subidas y guardadas correctamente.');
});

// Ruta para obtener la lista de imágenes
app.get('/imagenes', (req, res) => {
    const imagesDir = path.join(__dirname, 'imagenes');
    fs.readdir(imagesDir, (err, files) => {
        if (err) {
            console.error('Error leyendo la carpeta de imágenes:', err);
            return res.status(500).send('Error al obtener las imágenes.');
        }

        // Filtra solo archivos de imagen y devuelve la lista
        const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
        res.json(imageFiles);
    });
});

// Ruta para eliminar una imagen
app.delete('/imagenes/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, 'imagenes', imageName);

    fs.unlink(imagePath, err => {
        if (err) {
            console.error('Error al eliminar la imagen:', err);
            return res.status(500).send('Error al eliminar la imagen.');
        }
        console.log(`Imagen eliminada: ${imageName}`);
        res.status(200).send('Imagen eliminada correctamente.');
    });
});

// Ruta para subir videos
app.post('/upload-videos', upload.array('videos'), (req, res) => {
    const uploadedFiles = req.files;

    if (!uploadedFiles || uploadedFiles.length === 0) {
        return res.status(400).send('No se subieron archivos.');
    }

    uploadedFiles.forEach(file => {
        const tempPath = file.path;
        const targetPath = path.join(__dirname, 'videos', 'testimonios', file.filename);

        // Mueve el archivo a la carpeta "videos/testimonios"
        fs.rename(tempPath, targetPath, err => {
            if (err) {
                console.error('Error al mover el archivo:', err);
                return res.status(500).send('Error al guardar los videos.');
            }
        });
    });

    res.status(200).send('Videos subidos y guardados correctamente.');
});

// Ruta para obtener la lista de videos locales y enlaces de YouTube
app.get('/videos/testimonios', (req, res) => {
    const videosDir = path.join(__dirname, 'videos', 'testimonios');
    fs.readdir(videosDir, (err, files) => {
        if (err) {
            console.error('Error leyendo la carpeta de videos:', err);
            return res.status(500).send('Error al obtener los videos.');
        }

        // Filtra solo archivos de video
        const localVideos = files.filter(file => /\.(mp4|webm|ogg)$/i.test(file));

        // Leer los enlaces de YouTube
        fs.readFile(youtubeLinksFile, 'utf8', (err, data) => {
            if (err && err.code !== 'ENOENT') {
                console.error('Error leyendo los enlaces de YouTube:', err);
                return res.status(500).send('Error al obtener los enlaces de YouTube.');
            }

            const youtubeLinks = err ? [] : JSON.parse(data);
            res.json({ localVideos, youtubeLinks });
        });
    });
});

// Ruta para obtener los enlaces de YouTube
app.get('/youtube-links', (req, res) => {
    fs.readFile(youtubeLinksFile, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                return res.json([]); // Si el archivo no existe, devuelve una lista vacía
            }
            console.error('Error leyendo los enlaces de YouTube:', err);
            return res.status(500).send('Error al obtener los enlaces de YouTube.');
        }
        res.json(JSON.parse(data));
    });
});

// Ruta para agregar un enlace de YouTube
app.post('/youtube-links', express.json(), (req, res) => {
    const { videoId } = req.body;
    if (!videoId) {
        return res.status(400).send('ID de video no proporcionado.');
    }

    fs.readFile(youtubeLinksFile, 'utf8', (err, data) => {
        const links = err && err.code === 'ENOENT' ? [] : JSON.parse(data);
        links.push(videoId);

        fs.writeFile(youtubeLinksFile, JSON.stringify(links, null, 2), err => {
            if (err) {
                console.error('Error guardando el enlace de YouTube:', err);
                return res.status(500).send('Error al guardar el enlace de YouTube.');
            }
            res.status(200).send('Enlace de YouTube guardado correctamente.');
        });
    });
});

// Ruta para eliminar un enlace de YouTube
app.delete('/youtube-links/:videoId', (req, res) => {
    const videoId = req.params.videoId;

    fs.readFile(youtubeLinksFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Error leyendo los enlaces de YouTube:', err);
            return res.status(500).send('Error al eliminar el enlace de YouTube.');
        }

        const links = JSON.parse(data).filter(link => link !== videoId);

        fs.writeFile(youtubeLinksFile, JSON.stringify(links, null, 2), err => {
            if (err) {
                console.error('Error guardando los enlaces de YouTube:', err);
                return res.status(500).send('Error al eliminar el enlace de YouTube.');
            }
            res.status(200).send('Enlace de YouTube eliminado correctamente.');
        });
    });
});

// Ruta para comprobación de estado
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Iniciar el servidor con un timeout extendido
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});

server.setTimeout(60000); // Aumenta el timeout a 60 segundos