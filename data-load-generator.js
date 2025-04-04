class LoadDataGenerator {
    constructor() {
        this.batchSize = 1000; // Tamaño del lote para procesamiento por chunks
        this.dataTypes = {
            // Tipos de datos básicos
            ...this._getBasicTypes(),
            // Tipos de datos específicos de negocio
            ...this._getBusinessTypes(),
            // Tipos de datos técnicos
            ...this._getTechnicalTypes()
        };
    }

    _getBasicTypes() {
        return {
            uuid: () => faker.datatype.uuid(),
            boolean: () => faker.datatype.boolean(),
            color: () => faker.internet.color(),
            url: () => faker.internet.url(),
            ipv4: () => faker.internet.ip(),
            ipv6: () => faker.internet.ipv6(),
            userAgent: () => faker.internet.userAgent(),
            latitude: () => faker.address.latitude(),
            longitude: () => faker.address.longitude()
        };
    }

    _getBusinessTypes() {
        return {
            productName: () => faker.commerce.productName(),
            price: () => Number(faker.commerce.price()),
            sku: () => `SKU-${faker.random.alphaNumeric(8).toUpperCase()}`,
            department: () => faker.commerce.department(),
            transactionId: () => `TRX-${faker.random.alphaNumeric(10).toUpperCase()}`,
            creditCard: () => ({
                number: faker.finance.creditCardNumber(),
                cvv: faker.finance.creditCardCVV(),
                expiry: faker.date.future().toISOString().split('T')[0]
            }),
            currency: () => ({
                code: faker.finance.currencyCode(),
                amount: Number(faker.finance.amount())
            })
        };
    }

    _getTechnicalTypes() {
        return {
            timestamp: () => faker.date.recent().getTime(),
            jwt: () => `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${faker.random.alphaNumeric(32)}`,
            hash: (algorithm = 'md5') => {
                const hash = require('crypto').createHash(algorithm);
                return hash.update(faker.random.words()).digest('hex');
            },
            base64: () => Buffer.from(faker.random.words()).toString('base64')
        };
    }

    async generateLoadData(config) {
        const {
            count,
            types,
            format = 'json',
            validation = true,
            uniqueConstraints = []
        } = config;

        let results = [];
        const uniqueValues = new Map();
        const chunks = Math.ceil(count / this.batchSize);

        console.log(`Generando ${count} registros en ${chunks} chunks...`);

        for (let i = 0; i < chunks; i++) {
            const chunkSize = Math.min(this.batchSize, count - i * this.batchSize);
            const chunk = await this._generateChunk(chunkSize, types, validation, uniqueConstraints, uniqueValues);
            results = results.concat(chunk);

            console.log(`Chunk ${i + 1}/${chunks} completado`);
        }

        return this._formatOutput(results, format);
    }

    async _generateChunk(size, types, validation, uniqueConstraints, uniqueValues) {
        const chunk = [];
        
        for (let i = 0; i < size; i++) {
            const record = {};
            
            for (const [field, config] of Object.entries(types)) {
                let value = await this._generateValue(config);
                
                if (validation) {
                    value = this._validateValue(value, config);
                }
                
                if (uniqueConstraints.includes(field)) {
                    while (uniqueValues.has(`${field}:${value}`)) {
                        value = await this._generateValue(config);
                    }
                    uniqueValues.set(`${field}:${value}`, true);
                }
                
                record[field] = value;
            }
            
            chunk.push(record);
        }
        
        return chunk;
    }

    async _generateValue(config) {
        if (typeof config === 'string') {
            return this.dataTypes[config]?.() ?? null;
        }

        if (typeof config === 'object') {
            const { type, format, options = {} } = config;
            const generator = this.dataTypes[type];
            
            if (!generator) return null;
            
            let value = generator(options);
            
            if (format) {
                value = this._formatValue(value, format);
            }
            
            return value;
        }

        return null;
    }

    _validateValue(value, config) {
        if (!config.validation) return value;

        const { required, pattern, min, max, enum: enumValues } = config.validation;

        if (required && (value === null || value === undefined)) {
            throw new Error(`Campo requerido no puede ser nulo`);
        }

        if (pattern && typeof value === 'string' && !new RegExp(pattern).test(value)) {
            throw new Error(`Valor no cumple con el patrón: ${pattern}`);
        }

        if (typeof value === 'number') {
            if (min !== undefined && value < min) {
                throw new Error(`Valor menor al mínimo permitido: ${min}`);
            }
            if (max !== undefined && value > max) {
                throw new Error(`Valor mayor al máximo permitido: ${max}`);
            }
        }

        if (enumValues && !enumValues.includes(value)) {
            throw new Error(`Valor no está en la lista permitida: ${enumValues.join(', ')}`);
        }

        return value;
    }

    _formatOutput(data, format) {
        switch (format.toLowerCase()) {
            case 'json':
                return JSON.stringify(data, null, 2);
            case 'csv':
                return this._convertToCsv(data);
            case 'sql':
                return this._convertToSql(data);
            case 'xml':
                return this._convertToXml(data);
            case 'excel':
                return this._convertToExcel(data);
            default:
                return data;
        }
    }

    // Métodos auxiliares para formateo
    _convertToCsv(data) {
        if (data.length === 0) return '';
        
        const headers = Object.keys(data[0]);
        const csvRows = [headers.join(',')];
        
        for (const row of data) {
            const values = headers.map(header => {
                const value = row[header];
                return typeof value === 'object' ? JSON.stringify(value) : value;
            });
            csvRows.push(values.join(','));
        }
        
        return csvRows.join('\n');
    }

    _convertToSql(data) {
        if (data.length === 0) return '';
        
        const tableName = 'generated_data';
        const columns = Object.keys(data[0]);
        const sqlStatements = [];
        
        for (const row of data) {
            const values = columns.map(col => {
                const value = row[col];
                return typeof value === 'object' ? `'${JSON.stringify(value)}'` : `'${value}'`;
            });
            
            sqlStatements.push(
                `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values.join(', ')});`
            );
        }
        
        return sqlStatements.join('\n');
    }

    _convertToXml(data) {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<records>\n';
        
        for (const row of data) {
            xml += '  <record>\n';
            for (const [key, value] of Object.entries(row)) {
                xml += `    <${key}>${
                    typeof value === 'object' ? JSON.stringify(value) : value
                }</${key}>\n`;
            }
            xml += '  </record>\n';
        }
        
        xml += '</records>';
        return xml;
    }
}

// Exportar la clase para su uso
window.LoadDataGenerator = LoadDataGenerator;
