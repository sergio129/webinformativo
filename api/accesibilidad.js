const puppeteer = require('puppeteer');
const axeCore = require('axe-core');

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).send('Método no permitido');
    }

    const { url } = req.query;
    if (!url) {
        return res.status(400).send('URL no proporcionada.');
    }

    try {
        const browser = await puppeteer.launch({
            headless: true, // Ejecutar en modo headless
            args: ['--no-sandbox', '--disable-setuid-sandbox'] // Opciones para entornos restringidos
        });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Inyectar axe-core y ejecutar análisis
        await page.addScriptTag({ content: axeCore.source });
        const results = await page.evaluate(() => axe.run());

        await browser.close();

        // Procesar resultados
        const contraste = results.violations.some(v => v.id === 'color-contrast') ? 'Problemas detectados' : 'Aprobado';
        const etiquetasARIA = results.violations.some(v => v.id === 'aria-valid-attr') ? 'Problemas detectados' : 'Aprobado';
        const textoAlt = results.violations.some(v => v.id === 'image-alt') ? 'Problemas detectados' : 'Completo';
        const navegacionTeclado = results.violations.some(v => v.id === 'keyboard') ? 'Problemas detectados' : 'Aprobado';

        res.json({ contraste, etiquetasARIA, textoAlt, navegacionTeclado });
    } catch (error) {
        console.error('Error al validar accesibilidad:', error);
        res.status(500).send('Error al validar accesibilidad.');
    }
};
