const axios = require('axios');

(async () => {
    try {
        const response = await axios.post(
            'https://api-inference.huggingface.co/models/gpt2', // Cambia el modelo si es necesario
            { inputs: 'Hola, ¿cómo estás?' },
            {
                headers: {
                    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                },
            }
        );

        console.log('Respuesta de Hugging Face:', response.data.generated_text);
    } catch (error) {
        console.error('Error generando texto:', error.message);
        if (error.response) {
            console.error('Detalles del error:', error.response.data);
        }
    }
})();
