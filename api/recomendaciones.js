module.exports = async (req, res) => {
    if (req.method === 'POST') {
        try {
            const { contexto } = req.body;

            if (!contexto) {
                return res.status(400).send('El contexto es requerido.');
            }

            // Recomendaciones estáticas basadas en el contexto
            const recomendaciones = [
                `Realiza pruebas de carga para garantizar el rendimiento de ${contexto}.`,
                `Implementa pruebas automatizadas para reducir el tiempo de testing en ${contexto}.`,
                `Adopta un enfoque de pruebas basado en riesgos para priorizar áreas críticas en ${contexto}.`,
                `Utiliza herramientas de análisis estático para detectar errores en el código de ${contexto}.`,
                `Integra pruebas continuas en tu pipeline de CI/CD para ${contexto}.`
            ];

            return res.status(200).json(recomendaciones);
        } catch (error) {
            console.error('Error generando recomendaciones:', error.message);
            return res.status(500).send('Error al generar recomendaciones. Intenta nuevamente más tarde.');
        }
    } else {
        res.status(405).send('Método no permitido');
    }
};
