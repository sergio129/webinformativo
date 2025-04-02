const PDFDocument = require('pdfkit');

module.exports = (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).send('Método no permitido');
    }

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="reporte.pdf"');

    doc.pipe(res);
    doc.fontSize(20).text('Reporte de Métricas de Calidad', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text('Este es un reporte generado automáticamente con las métricas de calidad más recientes.');
    doc.end();
};
