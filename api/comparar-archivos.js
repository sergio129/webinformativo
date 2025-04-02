const fs = require('fs');
const path = require('path');
const diff = require('diff');
const pdfParse = require('pdf-parse');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).send('Método no permitido');
    }

    // Verificar que los archivos hayan sido enviados correctamente
    const archivo1 = req.files?.archivo1?.[0];
    const archivo2 = req.files?.archivo2?.[0];

    if (!archivo1 || !archivo2) {
        return res.status(400).json({
            error: 'Ambos archivos son requeridos. Asegúrate de enviarlos con los nombres "archivo1" y "archivo2".'
        });
    }

    try {
        // Leer el contenido de los archivos
        const contenido1 = await leerContenidoArchivo(archivo1.path);
        const contenido2 = await leerContenidoArchivo(archivo2.path);

        // Comparar los archivos y devolver las diferencias
        const diferencias = diff.diffLines(contenido1, contenido2);

        res.json(diferencias);
    } catch (error) {
        console.error('Error al procesar los archivos:', error.message);
        res.status(500).json({ error: 'Error al procesar los archivos. Intenta nuevamente.' });
    } finally {
        // Eliminar los archivos temporales después de procesarlos
        if (archivo1?.path) fs.unlink(archivo1.path, () => {});
        if (archivo2?.path) fs.unlink(archivo2.path, () => {});
    }
};

// Función para leer el contenido de un archivo (soporta texto y PDF)
async function leerContenidoArchivo(rutaArchivo) {
    const extension = path.extname(rutaArchivo).toLowerCase();

    if (extension === '.pdf') {
        const buffer = fs.readFileSync(rutaArchivo);
        const data = await pdfParse(buffer);
        return data.text; // Devuelve el texto extraído del PDF
    } else {
        return fs.readFileSync(rutaArchivo, 'utf8'); // Devuelve el contenido como texto plano
    }
}
