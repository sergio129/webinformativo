class DataGenerator {
    constructor() {
        // Verificar si faker está disponible
        if (typeof faker === 'undefined') {
            throw new Error('Faker.js no está cargado. Asegúrate de incluir la librería.');
        }
        // Configurar faker para español
        faker.locale = 'es';
        console.log('DataGenerator inicializado correctamente');
    }

    generateName() {
        try {
            const firstName = faker.name.firstName();
            const lastName = faker.name.lastName();
            return `${firstName} ${lastName}`;
        } catch (e) {
            console.error('Error generando nombre:', e);
            return 'Error generando nombre';
        }
    }

    generateEmail() {
        try {
            return faker.internet.email().toLowerCase();
        } catch (e) {
            console.error('Error generando email:', e);
            return 'error@example.com';
        }
    }

    generatePhone() {
        try {
            const areaCodes = ['310', '311', '312', '313', '314', '315', '316', '317', '318', '319'];
            const areaCode = areaCodes[Math.floor(Math.random() * areaCodes.length)];
            const number = Math.floor(Math.random() * 9000000) + 1000000;
            return `+57 ${areaCode}${number}`;
        } catch (e) {
            console.error('Error generando teléfono:', e);
            return '+57 3101234567';
        }
    }

    generateAddress() {
        try {
            const street = faker.address.streetName();
            const number = faker.random.number({ min: 1, max: 150 });
            const city = faker.address.city();
            return `${street} #${number}, ${city}`;
        } catch (e) {
            console.error('Error generando dirección:', e);
            return 'Error generando dirección';
        }
    }

    generateDate() {
        try {
            return faker.date.between('2020-01-01', new Date()).toISOString().split('T')[0];
        } catch (e) {
            console.error('Error generando fecha:', e);
            return new Date().toISOString().split('T')[0];
        }
    }

    generateNumber(type = 'integer') {
        try {
            switch(type) {
                case 'integer':
                    return faker.random.number({ min: 0, max: 1000 });
                case 'float':
                    return parseFloat(faker.random.number({ 
                        min: 0, max: 1000, precision: 0.01 
                    }).toFixed(2));
                case 'percentage':
                    return `${faker.random.number({ min: 0, max: 100 })}%`;
                default:
                    return faker.random.number({ min: 0, max: 1000 });
            }
        } catch (e) {
            console.error('Error generando número:', e);
            return 0;
        }
    }

    generateCompany() {
        try {
            return faker.company.companyName();
        } catch (e) {
            console.error('Error generando empresa:', e);
            return 'Error generando empresa';
        }
    }

    generate(type) {
        switch (type) {
            case 'names':
                return this.generateName();
            case 'emails':
                return this.generateEmail();
            case 'phones':
                return this.generatePhone();
            case 'addresses':
                return this.generateAddress();
            case 'dates':
                return this.generateDate();
            case 'numbers':
                return this.generateNumber(
                    ['integer', 'float', 'percentage'][Math.floor(Math.random() * 3)]
                );
            case 'companies':
                return this.generateCompany();
            default:
                return 'Tipo de dato no soportado';
        }
    }
}

// Inicializar el generador cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    try {
        if (!window.dataGenerator) {
            window.dataGenerator = new DataGenerator();
            console.log('DataGenerator creado y asignado globalmente');
        }
    } catch (error) {
        console.error('Error al inicializar DataGenerator:', error);
    }
});

// Función de ayuda para verificar disponibilidad
window.checkDataGenerator = () => {
    if (!window.dataGenerator) {
        throw new Error('DataGenerator no está inicializado');
    }
    return window.dataGenerator;
};
