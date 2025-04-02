const axios = require('axios');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).send('Método no permitido');
    }

    const { url, metodo, body } = req.body;
    if (!url || !metodo) {
        return res.status(400).send('URL y método son requeridos.');
    }

    try {
        const response = await axios({
            method: metodo,
            url,
            data: body,
            headers: { 'Content-Type': 'application/json' }
        });

        res.json({
            status: response.status,
            headers: response.headers,
            data: response.data
        });
    } catch (error) {
        console.error('Error al probar la API:', error.message);
        res.status(error.response?.status || 500).json({
            error: error.message,
            response: error.response?.data || null
        });
    }
};
